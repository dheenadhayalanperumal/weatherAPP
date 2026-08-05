// Metro requires literal paths, so this map has to be static — a dynamic
// require would fail at bundle time. It was previously duplicated verbatim in
// both CurrentWeather.jsx and HourData.jsx.
const imageSources = {
  "clear-day": require("../Image/icon/clear-day.png"),
  "clear-night": require("../Image/icon/clear-night.png"),
  cloudy: require("../Image/icon/cloudy.png"),
  fog: require("../Image/icon/fog.png"),
  hail: require("../Image/icon/hail.png"),
  "partly-cloudy-day": require("../Image/icon/partly-cloudy-day.png"),
  "partly-cloudy-night": require("../Image/icon/partly-cloudy-night.png"),
  "rain-snow-showers-day": require("../Image/icon/rain-snow-showers-day.png"),
  "rain-snow-showers-night": require("../Image/icon/rain-snow-showers-night.png"),
  "rain-snow": require("../Image/icon/rain-snow.png"),
  rain: require("../Image/icon/rain.png"),
  "showers-day": require("../Image/icon/showers-day.png"),
  "showers-night": require("../Image/icon/showers-night.png"),
  sleet: require("../Image/icon/sleet.png"),
  "snow-showers-day": require("../Image/icon/snow-showers-day.png"),
  "snow-showers-night": require("../Image/icon/snow-showers-night.png"),
  snow: require("../Image/icon/snow.png"),
  "thunder-rain": require("../Image/icon/thunder-rain.png"),
  "thunder-showers-day": require("../Image/icon/thunder-showers-day.png"),
  "thunder-showers-night": require("../Image/icon/thunder-showers-night.png"),
  thunder: require("../Image/icon/thunder.png"),
  wind: require("../Image/icon/wind.png"),
};

// Always returns a renderable source. Passing `undefined` to <Image source>
// renders a blank hole, which is what CurrentWeather did for any unmapped key.
export const weatherIcon = (key) => imageSources[key] || imageSources.cloudy;

export default imageSources;
