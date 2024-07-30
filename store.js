import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import weatherReducer from './reducers/weatherReducer';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the SerializableStateInvariantMiddleware
    }),
});

export default store;