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

const icons = {
  pressure: require("../Image/pressure.gif"),
  wind: require("../Image/wind.gif"),
  humidity: require("../Image/humidity.gif"),
  uv: require("../Image/uv-index.gif"),
};

// Visual Crossing omits fields for sparse stations — `uvindex` and `pressure`
// especially. Interpolating a missing value produced the literal text
// "null mb" on the tile.
const format = (value, unit = "") => (value == null ? "—" : `${value}${unit}`);

// `styles` is threaded down rather than read from module scope, because it is
// now rebuilt when the colour scheme changes.
const Metric = ({ icon, label, value, styles }) => (
  <View style={styles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
    <Image source={icon} style={styles.image} accessibilityElementsHidden importantForAccessibility="no" />
    {/* Two lines allowed: on a 320pt screen each tile is only ~65pt wide, and
        at a large system font scale "Humidity" and "UV Index" no longer fit on
        one line — they were previously clipped by `numberOfLines={1}`. */}
    <AppText style={styles.label} numberOfLines={2}>
      {label}
    </AppText>
    <AppText style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
      {value}
    </AppText>
  </View>
);

const ContentBox = () => {
  const today = useSelector((state) => state.weather.data?.days?.[0]);
  const styles = useThemedStyles(makeStyles);

  if (!today) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* The API is called with `unitGroup=uk`, under which Visual Crossing
            returns pressure in millibars and wind speed in mph. These were
            previously labelled "mph" and "km/h" respectively — the pressure
            label was a speed unit, and the wind label was the wrong one. */}
        <Metric icon={icons.pressure} label="Pressure" value={format(today.pressure, " mb")} styles={styles} />
        <Metric icon={icons.wind} label="Wind" value={format(today.windspeed, " mph")} styles={styles} />
        <Metric icon={icons.humidity} label="Humidity" value={format(today.humidity, "%")} styles={styles} />
        <Metric icon={icons.uv} label="UV Index" value={format(today.uvindex)} styles={styles} />
      </View>
    </View>
  );
};

export default ContentBox;

const makeStyles = ({ colors, cardShadow }) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.lg,
    },
    row: {
      flexDirection: "row",
      marginTop: spacing.lg,
      gap: spacing.md,
    },
    tile: {
      // Was a fixed `width: 80`. Four 80pt tiles need 320pt, but a 320pt-wide
      // device only has 290pt after padding, so the UV tile was clipped off
      // screen. `flex: 1` divides the available width instead.
      flex: 1,
      minHeight: size.tile,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.md,
      // The tile had vertical padding but none horizontal, so its text ran to the
      // very edge of the card on narrow screens.
      paddingHorizontal: spacing.xs,
      gap: spacing.xs,
      ...cardShadow,
    },
    image: {
      width: size.iconSm,
      height: size.iconSm,
      resizeMode: "contain",
    },
    label: {
      color: colors.onCard,
      fontWeight: weight.medium,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      textAlign: "center",
    },
    value: {
      color: colors.onCardMuted,
      fontWeight: weight.regular,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      textAlign: "center",
    },
  
  });
