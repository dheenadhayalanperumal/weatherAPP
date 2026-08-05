import React, { useCallback } from "react";
import { View, Modal, ScrollView, Pressable, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import AppText from "./AppText";
import ContentBox from "./ContentBox";
import Sunset from "./Sunset";
import HourDataCollection from "./HourDataCollection";
import { weatherIcon } from "./weatherIcons";
import { clearSelectedDay } from "../reducers/weatherReducer";
import { formatWeekday, formatLongDate } from "./dateUtils";
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

const formatTemp = (value) => (value == null ? "—" : `${value}°C`);

const DayDetail = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(makeStyles);
  const { colors, ripple } = useTheme();

  const days = useSelector((state) => state.weather.data?.days);
  const index = useSelector((state) => state.weather.selectedDay);
  const place = useSelector(
    (state) => state.weather.data?.resolvedAddress ?? state.weather.data?.address
  );

  const close = useCallback(() => dispatch(clearSelectedDay()), [dispatch]);

  const day = index != null && Array.isArray(days) ? days[index] : null;

  // `visible` is driven by the index rather than by mounting the Modal
  // conditionally, so the slide-out animation gets a chance to run.
  const visible = day != null;

  const shortPlace = place ? place.split(",")[0].trim() : "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      // Wires up the Android hardware back button and the swipe-down gesture.
      // Without it, back would exit the app rather than close this screen.
      onRequestClose={close}
      statusBarTranslucent
    >
      {day ? (
        <View
          style={[styles.container, { paddingTop: insets.top }]}
          // Stops VoiceOver from reaching the Home screen underneath.
          accessibilityViewIsModal
        >
          <View style={styles.header}>
            <Pressable
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Back"
              android_ripple={{ ...ripple, borderless: true }}
              style={({ pressed }) => [styles.back, pressed && styles.pressed]}
            >
              <AppText style={styles.backGlyph}>←</AppText>
            </Pressable>

            <View style={styles.headerText}>
              <AppText
                style={styles.title}
                numberOfLines={1}
                accessibilityRole="header"
              >
                {formatWeekday(day.datetime, index)}
              </AppText>
              <AppText style={styles.subtitle} numberOfLines={1}>
                {[formatLongDate(day.datetime), shortPlace]
                  .filter(Boolean)
                  .join(" · ")}
              </AppText>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + spacing.xl },
            ]}
          >
            <View style={styles.heroWrap}>
              <View
                style={styles.hero}
                accessible
                accessibilityLabel={`${day.conditions}, low ${formatTemp(
                  day.tempmin
                )}, high ${formatTemp(day.tempmax)}${
                  day.precipprob
                    ? `, ${day.precipprob} percent chance of rain`
                    : ""
                }`}
              >
                <Image
                  source={weatherIcon(day.icon)}
                  style={styles.heroIcon}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                />
                <AppText style={styles.conditions} numberOfLines={2}>
                  {day.conditions}
                </AppText>

                <View style={styles.rangeRow}>
                  <View style={styles.rangeItem}>
                    <AppText style={styles.rangeLabel}>LOW</AppText>
                    <AppText style={styles.rangeValue}>
                      {formatTemp(day.tempmin)}
                    </AppText>
                  </View>
                  <View style={styles.rangeDivider} />
                  <View style={styles.rangeItem}>
                    <AppText style={styles.rangeLabel}>HIGH</AppText>
                    <AppText style={styles.rangeValue}>
                      {formatTemp(day.tempmax)}
                    </AppText>
                  </View>
                </View>

                {day.precipprob ? (
                  <AppText style={styles.precip}>
                    {day.precipprob}% chance of rain
                  </AppText>
                ) : null}
              </View>
            </View>

            {/* Visual Crossing's plain-language summary, e.g. "Partly cloudy
                throughout the day with rain in the afternoon." */}
            {day.description ? (
              <AppText style={styles.description}>{day.description}</AppText>
            ) : null}

            {/* The same three cards the home screen uses, pointed at this day
                rather than at today. */}
            <ContentBox day={day} />
            <Sunset day={day} />
            <HourDataCollection day={day} title="Hour by hour" />
          </ScrollView>
        </View>
      ) : null}
    </Modal>
  );
};

export default DayDetail;

const makeStyles = ({ colors, cardShadow }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.sm,
      gap: spacing.xs,
    },
    back: {
      width: MIN_TOUCH_TARGET,
      height: MIN_TOUCH_TARGET,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: MIN_TOUCH_TARGET / 2,
    },
    backGlyph: {
      color: colors.heading,
      fontSize: type.title,
      lineHeight: lineHeight.title,
    },
    headerText: {
      flex: 1,
    },
    title: {
      color: colors.heading,
      fontSize: type.title,
      lineHeight: lineHeight.title,
      fontWeight: weight.bold,
    },
    subtitle: {
      color: colors.heading,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      opacity: 0.85,
    },
    content: {
      flexGrow: 1,
    },
    heroWrap: {
      paddingHorizontal: spacing.lg,
    },
    hero: {
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: radius.md,
      marginTop: spacing.md,
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      ...cardShadow,
    },
    heroIcon: {
      width: size.iconLg,
      height: size.iconLg,
      resizeMode: "contain",
    },
    conditions: {
      color: colors.onCard,
      fontSize: type.title,
      lineHeight: lineHeight.title,
      fontWeight: weight.bold,
      textAlign: "center",
    },
    rangeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.lg,
      marginTop: spacing.xs,
    },
    rangeItem: {
      alignItems: "center",
      gap: spacing.xs,
    },
    rangeDivider: {
      width: StyleSheet.hairlineWidth,
      alignSelf: "stretch",
      backgroundColor: colors.onCardMuted,
      opacity: 0.5,
    },
    rangeLabel: {
      color: colors.onCardMuted,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontWeight: weight.medium,
      letterSpacing: 1,
    },
    rangeValue: {
      color: colors.onCard,
      fontSize: type.temp,
      fontWeight: weight.bold,
    },
    precip: {
      color: colors.onCardAccent,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      textAlign: "center",
    },
    description: {
      color: colors.heading,
      fontSize: type.label,
      lineHeight: lineHeight.label,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    pressed: { opacity: 0.6 },
  });
