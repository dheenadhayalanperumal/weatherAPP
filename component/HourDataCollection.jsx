import React, { useMemo, useCallback } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AppText from "./AppText";
import HourData from "./HourData";
import { formatClockTime as formatTime } from "./dateUtils";
import {
  spacing,
  type,
  lineHeight,
  weight,
  useThemedStyles,
} from "../theme";

const HOURS_SHOWN = 24;

// One hour, in seconds. The hour currently in progress is still the useful
// "Now" entry, so the cutoff is set an hour back rather than at the exact
// current instant.
const ONE_HOUR = 3600;

// With `day` supplied (the day-detail screen) the strip shows that whole day
// from midnight. Without it (the home screen) it rolls forward from the current
// hour into tomorrow.
const HourDataCollection = ({ day, title = "Hourly Forecast" }) => {
  const data = useSelector((state) => state.weather.data);
  const styles = useThemedStyles(makeStyles);

  const hours = useMemo(() => {
    if (day) {
      const own = Array.isArray(day.hours) ? day.hours : [];
      return own
        .map((h) => ({ ...h, day: day.datetime }))
        .slice(0, HOURS_SHOWN);
    }

    const days = data?.days;
    if (!Array.isArray(days) || !Array.isArray(days[0]?.hours)) return [];

    const all = [
      ...days[0].hours.map((h) => ({ ...h, day: days[0].datetime })),
      ...(Array.isArray(days[1]?.hours)
        ? days[1].hours.map((h) => ({ ...h, day: days[1].datetime }))
        : []),
    ];

    // The start index is found via `datetimeEpoch`, which is an absolute
    // instant. The previous version compared the API's date string against the
    // *device's* calendar date and sliced with the device's `getHours()` — both
    // are in the user's timezone, not the forecast location's. Searching Tokyo
    // from London therefore opened the list on hours already in Tokyo's past,
    // with the first tile labelled "Now".
    const nowEpoch = data?.currentConditions?.datetimeEpoch;
    let start = 0;
    if (typeof nowEpoch === "number") {
      const index = all.findIndex(
        (h) => typeof h.datetimeEpoch === "number" && h.datetimeEpoch >= nowEpoch - ONE_HOUR
      );
      if (index >= 0) start = index;
    }

    return all.slice(start, start + HOURS_SHOWN);
  }, [data, day]);

  // Only the live strip has a "Now"; a named day starts at its own midnight.
  const showNow = !day;

  // Stable identity so the memoized HourData tiles are not all re-created on
  // every parent render.
  const renderItem = useCallback(
    ({ item, index }) => (
      <HourData
        time={index === 0 && showNow ? "Now" : formatTime(item.datetime)}
        temperature={item.temp}
        image={item.icon}
        precip={item.precipprob}
        isCurrent={index === 0 && showNow}
        isLastItem={index === hours.length - 1}
      />
    ),
    [hours.length, showNow]
  );

  if (hours.length === 0) return null;

  return (
    <View style={styles.container}>
      <AppText style={styles.title} accessibilityRole="header">
        {title}
      </AppText>
      {/* A horizontal FlatList virtualises cleanly here. The vertical weekly
          list is deliberately left as a .map() — a same-axis VirtualizedList
          inside the parent ScrollView would break virtualisation and warn. */}
      <FlatList
        horizontal
        data={hours}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyExtractor={(item, index) => `${item.day}-${item.datetime ?? index}`}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HourDataCollection;

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginTop: spacing.md,
    },
    title: {
      color: colors.heading,
      fontSize: type.heading,
      lineHeight: lineHeight.heading,
      marginTop: spacing.md,
      // `marginStart` rather than `marginLeft` so the heading stays on the
      // leading edge under a right-to-left locale.
      marginStart: spacing.lg,
      fontWeight: weight.medium,
    },
    list: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
  });
