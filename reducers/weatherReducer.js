import { createSlice } from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
    loading: false,
    error: null,
    // The query currently being fetched, so a failed search can be retried with
    // the city the user actually typed rather than a hardcoded fallback.
    lastQuery: null,
    // Human-readable name for `lastQuery`. For a coordinate lookup `lastQuery`
    // is "13.08,80.27", which is not something to put in an error message.
    lastLabel: null,
    // True only while a device GPS fix is being acquired. Kept separate from
    // `loading` so the "use my location" control can show its own busy state
    // without the whole screen switching to the network spinner.
    locating: false,
    // True only for a user-initiated pull-to-refresh. `RefreshControl` was
    // previously driven off `loading && !!data`, so an ordinary search made the
    // refresh spinner drop down from the top unprompted.
    refreshing: false,
    // When the currently displayed `data` arrived, so the UI can mark a reading
    // as stale rather than presenting an hour-old forecast as current.
    lastUpdated: null,
    // Index into `data.days` for the day-detail screen, or null when it is
    // closed. Kept in the store rather than in component state so that loading
    // a different city can close a screen that is now showing another place's
    // Wednesday.
    selectedDay: null,
  },
  reducers: {
    fetchWeatherStart: (state, action) => {
      state.loading = true;
      state.error = null;
      // The GPS phase is over once the network request starts.
      state.locating = false;
      const { query, label, refresh } = action.payload ?? {};
      state.refreshing = Boolean(refresh);
      state.lastQuery = query ?? state.lastQuery;
      state.lastLabel = label ?? state.lastLabel;
      // `data` is deliberately NOT cleared here. Clearing it unmounted the whole
      // UI on every search, which dismissed the keyboard and blanked the screen.
      // Keeping the previous city visible behind a spinner is far less jarring.
    },
    fetchWeatherSuccess: (state, action) => {
      state.loading = false;
      state.refreshing = false;
      state.error = null;
      state.data = action.payload;
      state.lastUpdated = Date.now();
      // A new forecast invalidates any open day screen — its index would point
      // at a different city's day.
      state.selectedDay = null;
    },
    fetchWeatherFailure: (state, action) => {
      state.loading = false;
      state.refreshing = false;
      state.locating = false;
      state.error = action.payload;
      // `data` and `lastUpdated` are left alone: the previous city stays on
      // screen, and Home marks it as stale rather than pretending it is fresh.
    },
    selectDay: (state, action) => {
      state.selectedDay = action.payload;
    },
    clearSelectedDay: (state) => {
      state.selectedDay = null;
    },
    locateStart: (state) => {
      state.locating = true;
      state.error = null;
    },
    // Used by the error boundary. A render crash is caused by the payload
    // currently in the store, so recovering means dropping that payload —
    // clearing only the boundary's own flag re-rendered the same components
    // over the same bad data and crashed again immediately.
    resetWeather: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.locating = false;
      state.refreshing = false;
      state.lastUpdated = null;
      state.selectedDay = null;
    },
  },
});

export const {
  fetchWeatherStart,
  fetchWeatherSuccess,
  fetchWeatherFailure,
  locateStart,
  resetWeather,
  selectDay,
  clearSelectedDay,
} = weatherSlice.actions;
export default weatherSlice.reducer;
