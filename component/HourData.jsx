import React from "react";
import { View, Image, StyleSheet } from "react-native";
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

// Visual Crossing omits fields on sparse stations, and `${null}°C` renders the
// literal string "null°C".
const formatTemp = (value) => (value == null ? "—" : `${value}°C`);

const HourData = ({ time, temperature, image, precip, isCurrent, isLastItem }) => {
  const styles = useThemedStyles(makeStyles);
  const hasPrecip = precip != null && precip > 0;

  const label = `${time}, ${temperature == null ? "temperature unavailable" : `${temperature} degrees`}${
    hasPrecip ? `, ${precip} percent chance of rain` : ""
  }`;

  return (
    <View
      style={[styles.tile, isCurrent && styles.tileCurrent, !isLastItem && styles.spacer]}
      accessible
      accessibilityLabel={label}
    >
      <AppText style={styles.time}>{time}</AppText>
      <Image
        source={weatherIcon(image)}
        style={styles.image}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      {/* The precipitation row is always laid out, even when there is nothing
          to show. It used to be conditionally rendered inside a
          `justifyContent: "space-between"` column, so dry tiles had three
          children and rainy ones had four — the icons and temperatures then sat
          at different heights from tile to tile and the strip looked broken on
          any mixed-forecast day. */}
      <View style={styles.precipSlot}>
        {hasPrecip ? <AppText style={styles.precip}>{precip}%</AppText> : null}
      </View>
      <AppText style={styles.temp}>{formatTemp(temperature)}</AppText>
    </View>
  );
};

// The list re-creates its rows on every parent render; without this all 24
// tiles re-render whenever anything in the tree above changes.
export default React.memo(HourData);

const makeStyles = ({ colors, cardShadow }) =>
  StyleSheet.create({
    tile: {
      // `minHeight` so the tile grows rather than clipping at larger font scales.
      minHeight: size.tile,
      width: size.tileWidth,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...cardShadow,
    },
    tileCurrent: {
      borderWidth: 2,
      borderColor: colors.heading,
    },
    spacer: {
      // `marginEnd` rather than `marginRight`, so the gap follows the reading
      // direction under a right-to-left locale.
      marginEnd: spacing.md,
    },
    image: {
      width: size.iconSm,
      height: size.iconSm,
      resizeMode: "contain",
    },
    time: {
      color: colors.onCard,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontWeight: weight.medium,
    },
    temp: {
      color: colors.onCard,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontWeight: weight.medium,
    },
    precipSlot: {
      height: lineHeight.caption,
      justifyContent: "center",
    },
    precip: {
      // Was 8px yellow at 1.96:1 — genuinely useful information rendered
      // essentially unreadable.
      color: colors.onCardAccent,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
    },
  });
