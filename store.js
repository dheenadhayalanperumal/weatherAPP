// `getDefaultMiddleware` is not a standalone export in Redux Toolkit 2.x — it
// was previously imported here and resolved to `undefined`, harmless only
// because the callback parameter below shadowed it.
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './reducers/weatherReducer';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  // The weather payload is plain JSON, so the serializable check is left on.
});

export default store;
