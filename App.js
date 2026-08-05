import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchWeatherData, DEFAULT_CITY } from './actions/weatherActions';
import Home from './component/Home';
import { useTheme } from './theme';

export default function App() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    // Loads a default city rather than prompting for location on launch. The
    // permission dialog is deliberately deferred to the location button, where
    // the user has asked for it and the reason is obvious — a cold prompt
    // before the app has shown anything is the single most common reason
    // people deny location for good.
    dispatch(fetchWeatherData(DEFAULT_CITY));
  }, [dispatch]);

  useEffect(() => {
    // Paints the window behind the React tree. Without this the native root
    // stays white, so rotating or over-scrolling in dark mode flashes a white
    // band at the edges of the app.
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  return (
    // `paddingTop: 40` was a magic number standing in for the status bar. It is
    // wrong on every device, and with `edgeToEdgeEnabled=true` (API 36) the app
    // now also draws under the gesture bar, so the bottom inset matters too —
    // it is applied to the ScrollView content in Home.
    //
    // The horizontal insets matter on a notched phone in landscape, where the
    // sensor housing otherwise sits on top of the leading edge of the content.
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <Home />
      {/* expo-status-bar accepts 'auto' | 'inverted' | 'light' | 'dark' — these
          name the CONTENT colour, not the background. "dark-content" was React
          Native's own barStyle value and was silently ignored here. Dark icons
          on the pale background, light icons on the dark one. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
