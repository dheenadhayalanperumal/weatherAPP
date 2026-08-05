import * as Location from 'expo-location';
import {
  fetchWeatherStart,
  fetchWeatherSuccess,
  fetchWeatherFailure,
  locateStart,
} from '../reducers/weatherReducer';

const BASE_URL =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

// NOTE: `EXPO_PUBLIC_*` values are inlined into the JS bundle at build time, so
// this keeps the key out of git but NOT out of the shipped app — anyone can
// extract it from the APK/IPA. The only real fix is a server-side proxy that
// holds the key and exposes an unauthenticated endpoint to the app.
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

// Shown on first launch, and used as the retry target before any search has
// been made. Exported so App.js and the retry path cannot drift apart.
export const DEFAULT_CITY = 'Chennai';

const REQUEST_TIMEOUT_MS = 10000;

// A cold GPS fix outdoors takes a few seconds; indoors it can fail to arrive at
// all. Without a ceiling the button would spin forever.
const LOCATION_TIMEOUT_MS = 15000;

// A cached fix this recent is good enough for weather and returns instantly,
// which avoids powering up the GPS radio for a repeat tap.
const LOCATION_MAX_AGE_MS = 5 * 60 * 1000;

// Monotonically increasing id so a slow response for an earlier query cannot
// overwrite a newer one. Without this, searching "London" then "Paris" shows
// whichever resolved last rather than whichever was asked for last.
let latestRequestId = 0;

// The controller for the request currently in flight, so a superseded request
// can actually be cancelled rather than left to run to completion holding a
// socket open only for its result to be discarded.
let inFlight = null;

// Marks every in-flight request as superseded and cancels it. Needed on the
// validation-failure paths too: those dispatch an error without bumping the id,
// so an already-running request stayed "latest" and its eventual success wiped
// the error message the user had just been shown.
const invalidateInFlight = () => {
  latestRequestId += 1;
  inFlight?.abort();
  inFlight = null;
};

// Marks a message as safe to show the user. Anything not thrown as one of these
// is an internal failure — a JSON parse error from a captive portal returning
// an HTML login page, say — and gets generic copy instead of leaking its
// internals into the UI.
class UserFacingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserFacingError';
  }
}

// A 200 carrying valid JSON of the wrong shape used to flow straight into the
// store. Every component then independently returned null, so the screen went
// blank with no spinner, no error and no retry — the null-guards turned a crash
// into a silent dead end. Rejecting it here is the only place it can be caught
// once.
const isUsableForecast = (data) =>
  Boolean(data) && Array.isArray(data.days) && Boolean(data.currentConditions);

// Weather is a regional quantity, so ~1km of precision is ample. Truncating
// here means the app never hands a third-party API the device's exact position,
// and repeat lookups from the same neighbourhood hit the upstream cache.
const COORD_PRECISION = 2;

const roundCoord = (value) => Number(value.toFixed(COORD_PRECISION));

// Distinguishes a "lat,lon" query from a city name. Used only to pick the right
// follow-up advice: telling someone to check the spelling of their own GPS
// coordinates is nonsense. Derived from the query rather than passed in, so the
// retry path gets it right too without having to store it.
const isCoordQuery = (query) => /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(query);

// Shared network core. `query` is what Visual Crossing is asked for (a city
// name or a "lat,lon" pair); `label` is how that is described back to the user,
// since "Could not find 13.08,80.27" is not a useful error message.
const requestWeather = (query, label, { refresh = false } = {}) => async (
  dispatch
) => {
  if (!API_KEY) {
    invalidateInFlight();
    dispatch(
      fetchWeatherFailure(
        'Weather service is not configured. Set EXPO_PUBLIC_WEATHER_API_KEY.'
      )
    );
    return;
  }

  // Cancels the previous request before starting this one. The abort makes the
  // predecessor reject with `AbortError`, which then fails its own id check
  // below and returns silently — so it cannot surface a spurious "timed out".
  inFlight?.abort();

  const requestId = ++latestRequestId;
  const controller = new AbortController();
  inFlight = controller;

  dispatch(fetchWeatherStart({ query, label, refresh }));

  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // `query` must be encoded: city names contain spaces, commas and periods
    // ("Washington, D.C."), and an unencoded `?` or `&` would let user input
    // inject query parameters into the upstream request.
    const url =
      `${BASE_URL}/${encodeURIComponent(query)}` +
      `?unitGroup=uk&key=${encodeURIComponent(API_KEY)}`;

    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      // 400/404 mean the location was not recognised; anything else is a
      // service-side problem and should not be blamed on the user's spelling.
      const notFoundHint = isCoordQuery(query)
        ? 'Try searching by city name instead.'
        : 'Check the spelling and try again.';

      throw new UserFacingError(
        response.status === 400 || response.status === 404
          ? `Could not find ${label}. ${notFoundHint}`
          : 'Weather service is unavailable right now. Please try again.'
      );
    }

    const data = await response.json();

    if (requestId !== latestRequestId) return; // superseded by a newer search

    if (!isUsableForecast(data)) {
      throw new UserFacingError(
        'The weather service returned an unexpected response. Please try again.'
      );
    }

    dispatch(fetchWeatherSuccess(data));
  } catch (error) {
    if (requestId !== latestRequestId) return;

    // `fetch` rejects with the bare string "Network request failed" when the
    // device is offline. That was previously rendered to the user verbatim.
    const isOffline = /network request failed/i.test(error?.message ?? '');

    const message =
      error?.name === 'AbortError'
        ? 'The request timed out. Check your connection and try again.'
        : isOffline
        ? 'You appear to be offline. Reconnect and try again.'
        : error instanceof UserFacingError
        ? error.message
        : // Anything else is internal — a JSON parse failure, a TypeError —
          // and its text is meaningless or alarming to a user.
          'Something went wrong fetching the weather. Please try again.';

    // Deliberately not re-thrown. The previous version re-threw here with a
    // comment saying it would be "caught in the component", but no caller
    // ever awaited or caught it, so every failed fetch produced an unhandled
    // promise rejection. The failure is already in Redux state and rendered.
    dispatch(fetchWeatherFailure(message));
  } finally {
    clearTimeout(timeoutId);
    if (inFlight === controller) inFlight = null;
  }
};

export const fetchWeatherData = (location) => {
  return async (dispatch) => {
    const query = String(location ?? '').trim();
    if (!query) {
      // Supersedes any running request first, so its later success cannot
      // silently overwrite the validation error being shown here.
      invalidateInFlight();
      dispatch(fetchWeatherFailure('Please enter a city name.'));
      return;
    }

    await dispatch(requestWeather(query, `"${query}"`));
  };
};

// Re-runs whatever was last asked for — used by both the Retry button and
// pull-to-refresh. It replays the stored query rather than calling
// `fetchWeatherData(lastQuery)`, because for a coordinate lookup the stored
// query is "13.08,80.27" and the user-facing label needs to stay "your
// location". Refreshing a located result deliberately does not re-read the GPS:
// the weather at those coordinates is what is being refreshed.
export const retryLastQuery = ({ refresh = false } = {}) => {
  return async (dispatch, getState) => {
    const { lastQuery, lastLabel } = getState().weather;

    if (!lastQuery) {
      await dispatch(fetchWeatherData(DEFAULT_CITY));
      return;
    }

    await dispatch(
      requestWeather(lastQuery, lastLabel || `"${lastQuery}"`, { refresh })
    );
  };
};

// `getCurrentPositionAsync` has no timeout of its own and can sit unresolved
// indefinitely where there is no signal, so it is raced against the clock.
const withTimeout = (promise, ms, message) => {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
};

export const fetchWeatherForCurrentLocation = () => {
  return async (dispatch) => {
    // Choosing "use my location" abandons any city search still in flight —
    // otherwise that search could resolve mid-GPS-fix and replace the result
    // the user just switched away from, or overwrite a permission error.
    invalidateInFlight();
    dispatch(locateStart());

    try {
      // Checked before prompting: with location services switched off at the
      // device level, the permission dialog grants a permission that still
      // cannot produce a fix, which reads to the user as a broken button.
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        dispatch(
          fetchWeatherFailure(
            'Location services are turned off. Turn them on in your device settings, or search by city name.'
          )
        );
        return;
      }

      // Foreground-only: the app has no reason to read location while
      // backgrounded, and requesting background access would need a qualifying
      // use case at Play Store review.
      const { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        dispatch(
          fetchWeatherFailure(
            canAskAgain
              ? 'Location permission is needed to use your current location. You can still search by city name.'
              : 'Location permission is blocked. Enable it for True Weather in your device settings, or search by city name.'
          )
        );
        return;
      }

      // A recent cached fix avoids spinning up the GPS radio at all, and falls
      // through to a live fix when there is nothing fresh enough.
      let position = await Location.getLastKnownPositionAsync({
        maxAge: LOCATION_MAX_AGE_MS,
      });

      if (!position) {
        position = await withTimeout(
          Location.getCurrentPositionAsync({
            // `Low` is accurate to roughly a kilometre, which is the right
            // resolution for weather and markedly faster and cheaper on
            // battery than the high-accuracy modes.
            accuracy: Location.Accuracy.Low,
          }),
          LOCATION_TIMEOUT_MS,
          'Timed out finding your location. Try again, or search by city name.'
        );
      }

      const { latitude, longitude } = position?.coords ?? {};
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        dispatch(
          fetchWeatherFailure(
            'Could not read your location. Try again, or search by city name.'
          )
        );
        return;
      }

      const query = `${roundCoord(latitude)},${roundCoord(longitude)}`;
      await dispatch(requestWeather(query, 'your location'));
    } catch (error) {
      dispatch(
        fetchWeatherFailure(
          error.message ||
            'Could not get your location. Try again, or search by city name.'
        )
      );
    }
  };
};
