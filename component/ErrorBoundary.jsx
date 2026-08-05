import React, { useCallback } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import AppText from "./AppText";
import { resetWeather } from "../reducers/weatherReducer";
import {
  spacing,
  radius,
  type,
  lineHeight,
  weight,
  MIN_TOUCH_TARGET,
  useThemedStyles,
  useTheme,
} from "../theme";

// The fallback lives in its own function component so it can read the theme —
// error boundaries have to be classes, and classes cannot use hooks.
const ErrorFallback = ({ onReset }) => {
  const styles = useThemedStyles(makeStyles);
  const { ripple } = useTheme();

  return (
    <View style={styles.container}>
      <AppText style={styles.title} accessibilityRole="header">
        Something went wrong
      </AppText>
      <AppText style={styles.body}>
        The app hit an unexpected problem displaying the weather. Starting over
        will clear it.
      </AppText>
      <Pressable
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Start over"
        android_ripple={ripple}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <AppText style={styles.buttonText}>Start over</AppText>
      </Pressable>
    </View>
  );
};

// Backstop for render-time crashes. Without this, a single unexpected field in
// the API response (e.g. a missing `sunrise`) throws during render, unwinds the
// whole tree and leaves a permanently white screen until the app is force-quit.
class ErrorBoundaryView extends React.Component {
  // `resetKey` is what makes recovery real. Flipping `hasError` alone re-renders
  // the *same* element tree, which React reconciles against the surviving
  // instances — so the component that just threw is handed the same props and
  // throws again. Changing the key forces a fresh mount instead.
  state = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info?.componentStack);
  }

  handleReset = () => {
    // Drops the store payload that caused the crash. Remounting over the same
    // data would simply crash again, which made this button a dead end.
    this.props.onReset?.();
    this.setState((prev) => ({ hasError: false, resetKey: prev.resetKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }

    return (
      <React.Fragment key={this.state.resetKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}

// Thin connected wrapper: supplies the dispatch the class cannot obtain itself.
const ErrorBoundary = ({ children }) => {
  const dispatch = useDispatch();
  const handleReset = useCallback(() => dispatch(resetWeather()), [dispatch]);

  return <ErrorBoundaryView onReset={handleReset}>{children}</ErrorBoundaryView>;
};

export default ErrorBoundary;

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xl,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: type.title,
      lineHeight: lineHeight.title,
      fontWeight: weight.bold,
      color: colors.heading,
      marginBottom: spacing.md,
    },
    body: {
      fontSize: type.label,
      lineHeight: lineHeight.label,
      color: colors.heading,
      textAlign: "center",
      marginBottom: spacing.xl,
    },
    button: {
      minHeight: MIN_TOUCH_TARGET,
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.card,
      borderRadius: radius.sm,
      overflow: "hidden",
    },
    buttonPressed: { opacity: 0.75 },
    buttonText: {
      color: colors.onCard,
      fontSize: type.label,
      lineHeight: lineHeight.label,
      fontWeight: weight.medium,
    },
  });
