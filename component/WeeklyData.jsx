import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AppText from "./AppText";
import {
  spacing,
  radius,
  type,
  lineHeight,
  weight,
  useThemedStyles,
} from "../theme";

// Visual Crossing's timeline endpoint returns 15 days by default, and the list
// rendered every one of them under a heading that said "Weekly".
const DAYS_SHOWN = 7;

// `new Date("2026-08-05")` parses as UTC midnight but `toLocaleDateString`
// formats in local time, so every row rendered as the previous day for any user
// west of UTC. Parsing the components explicitly yields local midnight.
const parseLocalDate = (isoDate) => {
  if (typeof isoDate !== "string") return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const formatRowDate = (isoDate, index) => {
  const date = parseLocalDate(isoDate);
  if (!date) return isoDate ?? "";
  if (index === 0) return "Today";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTemp = (value) => (value == null ? "—" : value);

const WeeklyData = () => {
  const days = useSelector((state) => state.weather.data?.days);
  const styles = useThemedStyles(makeStyles);

  if (!Array.isArray(days) || days.length === 0) return null;

  return (
    <View style={styles.container}>
      <AppText style={styles.title} accessibilityRole="header">
        Weekly Forecast
      </AppText>
      <View>
        {days.slice(0, DAYS_SHOWN).map((day, index) => {
          // Was computed twice per row, once for the label and once for display.
          const rowDate = formatRowDate(day.datetime, index);

          return (
            // Keyed on the date rather than the array index so React does not
            // reuse rows across entirely unrelated cities.
            <View
              key={day.datetime ?? index}
              style={styles.row}
              accessible
              accessibilityLabel={`${rowDate}: ${day.conditions}, low ${formatTemp(day.tempmin)}, high ${formatTemp(day.tempmax)} degrees Celsius`}
            >
              <AppText style={styles.date} numberOfLines={1}>
                {rowDate}
              </AppText>
              {/* Values like "Rain, Partially cloudy" wrapped and knocked the
                  columns out of alignment row by row. */}
              <AppText style={styles.conditions} numberOfLines={1} ellipsizeMode="tail">
                {day.conditions}
              </AppText>
              <AppText style={styles.temp} numberOfLines={1}>
                {formatTemp(day.tempmin)}/{formatTemp(day.tempmax)}°C
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default WeeklyData;

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    container: {
      width: "100%",
      paddingHorizontal: spacing.lg,
      marginTop: spacing.md,
    },
    title: {
      color: colors.heading,
      fontSize: type.heading,
      lineHeight: lineHeight.heading,
      marginBottom: spacing.md,
      marginTop: spacing.md,
      fontWeight: weight.medium,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: spacing.xs,
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      gap: spacing.sm,
    },
    date: {
      flex: 1.1,
      color: colors.onSurface,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontWeight: weight.medium,
    },
    conditions: {
      flex: 1.6,
      color: colors.onSurface,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontWeight: weight.regular,
    },
    temp: {
      flex: 1,
      // React Native's `textAlign` accepts only physical values
      // (auto|left|right|center|justify) — there is no logical `end`. This is
      // correct for the app as it ships; supporting a right-to-left locale would
      // mean branching on `I18nManager.isRTL` here, and none of the UI strings
      // are localised yet, so that is deferred rather than half-done.
      textAlign: "right",
      color: colors.onSurface,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontWeight: weight.medium,
    },
  });
