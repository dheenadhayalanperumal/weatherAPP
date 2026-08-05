import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AppText from "./AppText";
import {
  spacing,
  radius,
  size,
  type,
  lineHeight,
  weight,
  useThemedStyles,
} from "../theme";

// NOTE: these two asset files are misnamed on disk — Image/sunset.png contains
// the sunrise glyph (sun rising over waves) and Image/sunrise.png contains the
// sunset glyph (sun with a downward arrow). The mapping below is deliberately
// crossed so the rendered icon matches its label. Verified against a device
// screenshot; do not "correct" it by matching the filenames.
const sunriseIcon = require("../Image/sunset.png");
const sunsetIcon = require("../Image/sunrise.png");

// Total function: the previous version called `.split(":")` unconditionally, so
// a missing `sunrise` field threw a TypeError during render and took down the
// whole app.
//
// The API's "HH:MM:SS" is already local to the forecast location, so it is
// formatted in place rather than via the epoch (which would convert it into the
// *device's* timezone). Locale formatting means a US user sees "5:47 AM" rather
// than the raw 24-hour string.
const formatTime = (timeString) => {
  if (typeof timeString !== "string") return "--:--";
  const [hour, minute] = timeString.split(":");
  const h = Number(hour);
  if (!Number.isInteger(h) || minute === undefined) return "--:--";

  // An arbitrary date, so only the time portion is formatted.
  return new Date(2000, 0, 1, h, Number(minute) || 0).toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit" }
  );
};

const Sunset = () => {
  const today = useSelector((state) => state.weather.data?.days?.[0]);
  const styles = useThemedStyles(makeStyles);

  if (!today) return null;

  const sunrise = formatTime(today.sunrise);
  const sunset = formatTime(today.sunset);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* The icons were previously swapped — sunset.png sat above the
            "sunrise" label and vice versa. */}
        <View style={styles.item} accessible accessibilityLabel={`Sunrise at ${sunrise}`}>
          <Image source={sunriseIcon} style={styles.image} accessibilityElementsHidden importantForAccessibility="no" />
          <AppText style={styles.label}>Sunrise</AppText>
          <AppText style={styles.value}>{sunrise}</AppText>
        </View>
        <View style={styles.item} accessible accessibilityLabel={`Sunset at ${sunset}`}>
          <Image source={sunsetIcon} style={styles.image} accessibilityElementsHidden importantForAccessibility="no" />
          <AppText style={styles.label}>Sunset</AppText>
          <AppText style={styles.value}>{sunset}</AppText>
        </View>
      </View>
    </View>
  );
};

export default Sunset;

const makeStyles = ({ colors, cardShadow }) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.lg,
    },
    card: {
      minHeight: size.sunCard,
      alignSelf: "stretch",
      marginTop: spacing.lg,
      borderRadius: radius.md,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: spacing.lg,
      backgroundColor: colors.card,
      ...cardShadow,
    },
    item: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
    },
    image: {
      width: size.iconMd,
      height: 33,
      resizeMode: "contain",
    },
    label: {
      color: colors.onCard,
      fontSize: type.label,
      lineHeight: lineHeight.label,
      fontWeight: weight.medium,
    },
    value: {
      color: colors.onCardMuted,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontWeight: weight.regular,
    },
  });
