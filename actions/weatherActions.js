import { fetchWeatherStart, fetchWeatherSuccess, fetchWeatherFailure } from '../reducers/weatherReducer';

export const fetchWeatherData = (location) => {
  return async (dispatch) => {
    try {
      dispatch(fetchWeatherStart());
      const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=uk&key=YDKLNUJLBQLPSZXWKD3MT5XQS`);
      if (!response.ok) {
        throw new Error('Please enter a valid location'); // Throw an error if the response is not OK
      }
      const data = await response.json();
      dispatch(fetchWeatherSuccess(data));
    } catch (error) {
      dispatch(fetchWeatherFailure(error.toString()));
      // alert(`Error fetching weather data: ${error.toString()}`); // Alert the error
      throw error; // Re-throw the error to be caught in the component
    }
  };
};