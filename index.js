import { registerRootComponent } from 'expo';
import React from 'react'; // Import React
import { Provider } from 'react-redux'; // Import Provider
import App from './App';
import store from './store'; // Make sure to create this file and configure your Redux store

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// Register the ReduxApp component instead of App
registerRootComponent(ReduxApp);