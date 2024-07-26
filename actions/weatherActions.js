import { fetchWeatherStart, fetchWeatherSuccess, fetchWeatherFailure } from '../reducers/weatherReducer';

export const fetchWeatherData = (location) => async (dispatch) => {
  try {
    dispatch(fetchWeatherStart());
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=uk&key=YDKLNUJLBQLPSZXWKD3MT5XQS`);
    const data = await response.json();
    dispatch(fetchWeatherSuccess(data));
  } catch (error) {
    dispatch(fetchWeatherFailure(error.toString()));
  }
};


// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/London,UK?key=YOUR_API_KEY 