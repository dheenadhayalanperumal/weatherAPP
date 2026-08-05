import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AppText from "./AppText";
import { weatherIcon } from "./weatherIcons";
import {
  spacing,
  radius,
  size,
  type,
  lineHeight,
  weight,
  useThemedStyles,
} from "../theme";

const formatTemp = (value) => (value == null ? "—" : `${value}°C`);

const CurrentWeather = () => {
  const data = useSelector((state) => state.weather.data);
  const styles = useThemedStyles(makeStyles);

  // Guards the paths actually dereferenced below. The old `if (!data)` check
  // passed for any 200 response with a partial body, then threw on
  // `data.currentConditions.icon` and white-screened the app.
  const current = data?.currentConditions;
  const today = data?.days?.[0];
  if (!current) return null;

  // `address` is the raw string the API was queried with — so it showed the
  // user's own lowercase typing ("chennai"), and after a current-location
  // lookup it would have shown bare coordinates ("13.08,80.27").
  // `resolvedAddress` is the place the service actually matched.
  const place = data.resolvedAddress || data.address || "";
  // "Chennai, Tamil Nadu, India" does not fit the half-width column, so the
  // locality leads and the full string goes to the screen reader.
  const shortPlace = place.split(",")[0].trim() || place;

  const cardLabel = [
    place ? `Weather in ${place}` : "Current weather",
    current.conditions,
    `${formatTemp(current.temp)}`,
    `feels like ${formatTemp(current.feelslike)}`,
    current.precipprob ? `${current.precipprob} percent chance of rain` : null,
    today ? `low ${formatTemp(today.tempmin)}, high ${formatTemp(today.tempmax)}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <View style={styles.container}>
      {/* Grouped into a single accessibility node. Every other card already
          composes one label; this one exposed six separate stops, and the
          all-caps "FEELS LIKE" was read out letter by letter by VoiceOver. */}
      <View style={styles.card} accessible accessibilityLabel={cardLabel}>
        <View style={styles.inner}>
          <View style={styles.column}>
            <Image
              source={weatherIcon(current.icon)}
              style={styles.image}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <AppText style={styles.conditions} numberOfLines={2}>
              {current.conditions}
            </AppText>
            {current.precipprob ? (
              <AppText style={styles.precip}>
                {current.precipprob}% chance of rain
              </AppText>
            ) : null}
          </View>

          <View style={styles.column}>
            <AppText style={styles.address} numberOfLines={1} ellipsizeMode="tail">
              {shortPlace}
            </AppText>
            <AppText style={styles.temp} maxFontSizeMultiplier={1.2}>
              {formatTemp(current.temp)}
            </AppText>
            <AppText style={styles.label}>FEELS LIKE</AppText>
            <AppText style={styles.feelsLike}>{formatTemp(current.feelslike)}</AppText>
          </View>
        </View>

        {today ? (
          <View style={styles.minMaxRow}>
            <AppText style={styles.minMax}>Min {formatTemp(today.tempmin)}</AppText>
            <AppText style={styles.minMax}>Max {formatTemp(today.tempmax)}</AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default CurrentWeather;

const makeStyles = ({ colors, cardShadow }) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.lg,
    },
    card: {
      // `minHeight` rather than a fixed 210 so the card grows instead of clipping
      // when the OS font size is increased.
      minHeight: size.heroCard,
      alignSelf: "stretch",
      backgroundColor: colors.card,
      borderRadius: radius.md,
      marginTop: spacing.lg,
      justifyContent: "space-evenly",
      paddingVertical: spacing.lg,
      ...cardShadow,
    },
    inner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    column: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    image: {
      width: size.iconLg,
      height: size.iconLg,
      resizeMode: "contain",
    },
    conditions: {
      fontSize: type.title,
      lineHeight: lineHeight.title,
      fontWeight: weight.bold,
      color: colors.onCard,
      textAlign: "center",
    },
    precip: {
      fontSize: type.caption, // was 8px, below the practical legibility floor
      lineHeight: lineHeight.caption,
      fontWeight: weight.regular,
      color: colors.onCardAccent,
      textAlign: "center",
    },
    address: {
      fontSize: type.heading,
      lineHeight: lineHeight.heading,
      fontWeight: weight.medium, // was the invalid "medium" string
      color: colors.onCard,
      textAlign: "center",
    },
    temp: {
      fontSize: type.temp,
      fontWeight: weight.bold,
      color: colors.onCard,
    },
    label: {
      fontSize: type.label,
      lineHeight: lineHeight.label,
      fontWeight: weight.medium,
      color: colors.onCardMuted,
    },
    feelsLike: {
      fontSize: type.body,
      lineHeight: lineHeight.body,
      fontWeight: weight.medium,
      color: colors.onCard,
    },
    minMaxRow: {
      flexDirection: "row",
      // was `alignItems: "left"`, not a valid flexbox value and silently ignored
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
    },
    minMax: {
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontWeight: weight.medium,
      color: colors.onCard,
    },
  });
