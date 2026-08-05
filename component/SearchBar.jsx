import React, { useState, useCallback } from "react";
import {
  View,
  Pressable,
  TextInput,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppText from "./AppText";
import {
  fetchWeatherData,
  fetchWeatherForCurrentLocation,
} from "../actions/weatherActions";
import {
  spacing,
  radius,
  size,
  type,
  lineHeight,
  weight,
  useTheme,
  useThemedStyles,
  MIN_TOUCH_TARGET,
} from "../theme";

// A ring with a centre dot — the conventional "current location" glyph, drawn
// with Views rather than pulled from an icon font. The app has no icon library,
// and an emoji pin renders differently on every platform and OS version.
const LocationGlyph = ({ color }) => (
  <View style={[glyph.ring, { borderColor: color }]}>
    <View style={[glyph.dot, { backgroundColor: color }]} />
  </View>
);

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const dispatch = useDispatch();
  const styles = useThemedStyles(makeStyles);
  const { colors, ripple } = useTheme();

  // Narrow selectors: Immer returns a new slice object on every action, so
  // selecting the whole slice re-rendered this component every time weather
  // data arrived.
  const loading = useSelector((state) => state.weather.loading);
  const locating = useSelector((state) => state.weather.locating);

  const trimmed = location.trim();
  const busy = loading || locating;
  const canSearch = trimmed.length > 0 && !busy;

  const handleSearch = useCallback(() => {
    if (!canSearch) return; // guards empty input and double-submission
    Keyboard.dismiss();
    dispatch(fetchWeatherData(trimmed));
  }, [canSearch, dispatch, trimmed]);

  const handleUseLocation = useCallback(() => {
    if (busy) return;
    Keyboard.dismiss();
    dispatch(fetchWeatherForCurrentLocation());
  }, [busy, dispatch]);

  const hasText = location.length > 0;

  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name…"
          placeholderTextColor={colors.onCardMuted}
          onChangeText={setLocation}
          value={location}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
          // iOS's own `clearButtonMode` is deliberately NOT used: it draws its
          // own control in this exact spot and would sit on top of the buttons
          // below. Rendering both affordances here keeps the two platforms
          // identical.
          textContentType="addressCity"
          autoComplete="postal-address-locality"
          // The placeholder disappears once the user types, so it cannot serve
          // as the accessible name on its own.
          accessibilityLabel="City name"
          accessibilityHint="Enter a city, then activate the search button"
        />

        {/* Trailing slot inside the field. It holds the clear button while
            there is text and the location button while there is not — one
            44pt control at a time. Showing both at once would cost 88pt of an
            input that is only ~200pt wide on a small phone, and once a city
            has been typed, "use my location" is no longer the action being
            reached for; clearing the field brings it straight back. */}
        <View style={styles.trailing}>
          {hasText ? (
            <Pressable
              onPress={() => setLocation("")}
              accessibilityRole="button"
              accessibilityLabel="Clear city name"
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <AppText style={styles.clearText}>✕</AppText>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleUseLocation}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel="Use my current location"
              accessibilityHint="Gets the weather where you are now"
              accessibilityState={{ disabled: busy, busy: locating }}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
                // Not dimmed while locating: that is an active, in-progress
                // state, and fading the spinner would hide the feedback
                // exactly when the user is waiting on it.
                busy && !locating && styles.disabledIcon,
              ]}
            >
              {locating ? (
                <ActivityIndicator size="small" color={colors.onCard} />
              ) : (
                <LocationGlyph color={colors.onCard} />
              )}
            </Pressable>
          )}
        </View>
      </View>

      <Pressable
        onPress={handleSearch}
        disabled={!canSearch}
        accessibilityRole="button"
        accessibilityLabel="Search"
        accessibilityState={{ disabled: !canSearch, busy: loading }}
        android_ripple={ripple}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          !canSearch && styles.buttonDisabled,
        ]}
      >
        <AppText style={styles.buttonText}>Search</AppText>
      </Pressable>
    </View>
  );
};

export default SearchBar;

const glyph = StyleSheet.create({
  ring: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: spacing.md,
    },
    inputWrap: {
      // `flex: 1` instead of the old `width - 120`, which spanned nearly the
      // full width of a tablet.
      flex: 1,
      justifyContent: "center",
    },
    input: {
      // Was `height / 20` — 33pt on an iPhone SE, never reaching the 44pt
      // minimum on any phone, and scaled off the wrong axis entirely.
      minHeight: MIN_TOUCH_TARGET,
      color: colors.onCard,
      backgroundColor: colors.card,
      paddingStart: spacing.lg,
      // Reserved unconditionally, so swapping the trailing button does not
      // reflow the text under the caret.
      paddingEnd: MIN_TOUCH_TARGET,
      borderRadius: radius.sm,
      fontSize: type.label,
    },
    trailing: {
      position: "absolute",
      end: 0,
      top: 0,
      bottom: 0,
      justifyContent: "center",
    },
    iconButton: {
      width: MIN_TOUCH_TARGET,
      height: MIN_TOUCH_TARGET,
      alignItems: "center",
      justifyContent: "center",
    },
    disabledIcon: { opacity: 0.5 },
    clearText: {
      color: colors.onCardMuted,
      fontSize: type.label,
    },
    button: {
      minHeight: MIN_TOUCH_TARGET,
      minWidth: size.buttonWidth, // was the obfuscated `width - (width - 80)`
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.card,
      borderRadius: radius.sm,
      overflow: "hidden", // clips the Android ripple to the rounded corners
    },
    pressed: { opacity: 0.75 },
    buttonDisabled: {
      // A dedicated surface rather than `opacity: 0.5`, which dropped the label
      // to roughly 2.1:1 in what is the button's state on first launch.
      backgroundColor: colors.cardDisabled,
    },
    buttonText: {
      color: colors.onCard,
      fontWeight: weight.medium,
      fontSize: type.label,
      lineHeight: lineHeight.label,
    },
  });
