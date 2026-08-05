import React, { useMemo, useCallback } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AppText from "./AppText";
import HourData from "./HourData";
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

// "HH:MM:SS" -> a locale-formatted time. The raw API string was rendered
// directly, so a US user saw "18:00" where their OS convention is "6 PM".
// Formatted off the epoch would give the *device's* timezone; these strings are
// already local to the forecast location, so they are formatted as-is.
const formatTime = (timeString) => {
  if (typeof timeString !== "string") return "--:--";
  const [hour, minute] = timeString.split(":");
  const h = Number(hour);
  if (!Number.isInteger(h) || minute === undefined) return "--:--";

  // Built against an arbitrary date so only the time portion is formatted.
  const date = new Date(2000, 0, 1, h, Number(minute) || 0);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

const HourDataCollection = () => {
  const data = useSelector((state) => state.weather.data);
  const styles = useThemedStyles(makeStyles);

  const hours = useMemo(() => {
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
  }, [data]);

  // Stable identity so the memoized HourData tiles are not all re-created on
  // every parent render.
  const renderItem = useCallback(
    ({ item, index }) => (
      <HourData
        time={index === 0 ? "Now" : formatTime(item.datetime)}
        temperature={item.temp}
        image={item.icon}
        precip={item.precipprob}
        isCurrent={index === 0}
        isLastItem={index === hours.length - 1}
      />
    ),
    [hours.length]
  );

  if (hours.length === 0) return null;

  return (
    <View style={styles.container}>
      <AppText style={styles.title} accessibilityRole="header">
        Hourly Forecast
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
