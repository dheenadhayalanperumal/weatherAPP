import { registerRootComponent } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App';
import ErrorBoundary from './component/ErrorBoundary';
import store from './store';

const ReduxApp = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </SafeAreaProvider>
  </Provider>
);

registerRootComponent(ReduxApp);
