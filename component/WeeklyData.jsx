import React, { useCallback } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AppText from "./AppText";
import { selectDay } from "../reducers/weatherReducer";
import { formatRowDate } from "./dateUtils";
import {
  spacing,
  radius,
  type,
  lineHeight,
  weight,
  useTheme,
  useThemedStyles,
  MIN_TOUCH_TARGET,
} from "../theme";

// Visual Crossing's timeline endpoint returns 15 days by default, and the list
// rendered every one of them under a heading that said "Weekly".
const DAYS_SHOWN = 7;

const formatTemp = (value) => (value == null ? "—" : value);

const WeeklyData = () => {
  const days = useSelector((state) => state.weather.data?.days);
  const styles = useThemedStyles(makeStyles);
  const { ripple } = useTheme();
  const dispatch = useDispatch();

  const openDay = useCallback((index) => dispatch(selectDay(index)), [dispatch]);

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
            <Pressable
              key={day.datetime ?? index}
              onPress={() => openDay(index)}
              android_ripple={ripple}
              accessibilityRole="button"
              accessibilityLabel={`${rowDate}: ${day.conditions}, low ${formatTemp(day.tempmin)}, high ${formatTemp(day.tempmax)} degrees Celsius`}
              accessibilityHint="Opens the full forecast for this day"
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
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
              {/* A chevron is the only thing that tells the user these rows do
                  anything at all — without it the whole feature is invisible. */}
              <AppText style={styles.chevron} accessibilityElementsHidden importantForAccessibility="no">
                ›
              </AppText>
            </Pressable>
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
      // Rows are interactive now, so they carry a real touch target.
      minHeight: MIN_TOUCH_TARGET,
      marginVertical: spacing.xs,
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      gap: spacing.sm,
      overflow: "hidden", // clips the Android ripple to the rounded corners
    },
    rowPressed: { opacity: 0.7 },
    chevron: {
      color: colors.onSurface,
      fontSize: type.heading,
      lineHeight: lineHeight.heading,
      opacity: 0.55,
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
      flex: 1.05,
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
