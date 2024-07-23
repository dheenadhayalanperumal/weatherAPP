import { fetchWeatherStart, fetchWeatherSuccess, fetchWeatherFailure } from '../reducers/weatherReducer';

export const fetchWeatherData = () => async (dispatch) => {
  try {
    dispatch(fetchWeatherStart());
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/13.0843,80.2705?unitGroup=uk&key=YDKLNUJLBQLPSZXWKD3MT5XQS");
    const data = await response.json();
    dispatch(fetchWeatherSuccess(data));
  } catch (error) {
    dispatch(fetchWeatherFailure(error.toString()));
  }
};
