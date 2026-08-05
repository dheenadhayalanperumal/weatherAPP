import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  AccessibilityInfo,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import AppText from "./AppText";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ContentBox from "./ContentBox";
import HourDataCollection from "./HourDataCollection";
import WeeklyData from "./WeeklyData";
import Sunset from "./Sunset";
import { retryLastQuery } from "../actions/weatherActions";
import {
  spacing,
  radius,
  type,
  lineHeight,
  weight,
  MIN_TOUCH_TARGET,
  useThemedStyles,
  useTheme,
} from "../theme";

const formatUpdated = (timestamp) =>
  new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

const Home = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(makeStyles);
  const { colors, ripple } = useTheme();

  // Narrow selectors. Every component previously selected the whole `weather`
  // slice, and Immer hands back a new slice object on each action, so react-
  // redux's reference comparison re-rendered all of them on every dispatch.
  const data = useSelector((state) => state.weather.data);
  const loading = useSelector((state) => state.weather.loading);
  const error = useSelector((state) => state.weather.error);
  const refreshing = useSelector((state) => state.weather.refreshing);
  const lastUpdated = useSelector((state) => state.weather.lastUpdated);

  const handleRetry = useCallback(() => {
    // Replays the query that actually failed. This was hardcoded to "Chennai",
    // so retrying a failed search for "Berlin" silently loaded a different city.
    dispatch(retryLastQuery());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(retryLastQuery({ refresh: true }));
  }, [dispatch]);

  // `accessibilityLiveRegion` is Android-only, so on iOS a failed search
  // produced no announcement at all — a VoiceOver user tapped Search and got
  // silence. `announceForAccessibility` works on both platforms.
  useEffect(() => {
    if (error) AccessibilityInfo.announceForAccessibility(error);
  }, [error]);

  // Announces the newly loaded city. The ref skips the first resolved value so
  // the app does not talk over the user during launch.
  const resolved = data?.resolvedAddress ?? data?.address ?? null;
  const previousAddress = useRef(null);
  useEffect(() => {
    if (
      resolved &&
      previousAddress.current &&
      resolved !== previousAddress.current
    ) {
      AccessibilityInfo.announceForAccessibility(
        `Showing weather for ${resolved}`
      );
    }
    previousAddress.current = resolved;
  }, [resolved]);

  // An error showing over previously loaded data means what is on screen is no
  // longer what the user asked for.
  const isStale = Boolean(error && data);

  // The search bar and any already-loaded data stay mounted through both the
  // loading and error states. Previously each of these was an early `return`
  // that unmounted <SearchBar />, so a mistyped city left the user with no way
  // to search again.
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xl },
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={
        // Driven by a dedicated flag. `loading && !!data` meant an ordinary
        // search dropped the pull-to-refresh spinner down from the top, and a
        // real pull with no data yet showed nothing at all.
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.heading}
          colors={[colors.card]}
        />
      }
    >
      <View style={styles.searchRow}>
        <SearchBar />
      </View>

      {error ? (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <AppText style={styles.errorText}>{error}</AppText>
          <Pressable
            onPress={handleRetry}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Retry"
            accessibilityState={{ disabled: loading, busy: loading }}
            android_ripple={ripple}
            style={({ pressed }) => [
              styles.retry,
              pressed && styles.pressed,
              loading && styles.retryDisabled,
            ]}
          >
            <AppText style={styles.retryText}>Retry</AppText>
          </Pressable>
        </View>
      ) : null}

      {loading && !data ? (
        <View
          style={styles.notice}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Loading weather"
        >
          <ActivityIndicator size="large" color={colors.card} />
        </View>
      ) : null}

      {/* Before this, a user who had not yet searched — or whose first load
          failed and was then dismissed — faced a search box on an empty blue
          field with nothing telling them what to do next. */}
      {!data && !loading && !error ? (
        <View style={styles.notice}>
          <AppText style={styles.emptyTitle} accessibilityRole="header">
            No forecast yet
          </AppText>
          <AppText style={styles.emptyBody}>
            Search for a city, or use your current location, to see the weather.
          </AppText>
        </View>
      ) : null}

      {data ? (
        <View>
          {isStale ? (
            <AppText style={styles.staleLabel}>
              Showing the last result
              {lastUpdated ? `, from ${formatUpdated(lastUpdated)}` : ""}
            </AppText>
          ) : null}
          {/* Dimming is a supporting hint only — the label above carries the
              meaning, so staleness is not signalled by appearance alone. */}
          <View style={isStale ? styles.stale : null}>
            <CurrentWeather />
            <ContentBox />
            <Sunset />
            <HourDataCollection />
            <WeeklyData />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default Home;

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      // No `alignItems: "center"` — it made the container shrink-to-fit, which
      // broke the `width: "100%"` used by the cards.
      flexGrow: 1,
    },
    searchRow: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    notice: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl,
      gap: spacing.md,
    },
    errorText: {
      color: colors.error,
      fontSize: type.label,
      lineHeight: lineHeight.label,
      textAlign: "center",
    },
    emptyTitle: {
      color: colors.heading,
      fontSize: type.title,
      lineHeight: lineHeight.title,
      fontWeight: weight.bold,
    },
    emptyBody: {
      color: colors.heading,
      fontSize: type.label,
      lineHeight: lineHeight.label,
      textAlign: "center",
    },
    stale: { opacity: 0.65 },
    staleLabel: {
      color: colors.heading,
      fontSize: type.caption,
      lineHeight: lineHeight.caption,
      fontStyle: "italic",
      textAlign: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    retry: {
      minHeight: MIN_TOUCH_TARGET,
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.card,
      borderRadius: radius.sm,
      overflow: "hidden",
    },
    pressed: { opacity: 0.75 },
    retryDisabled: { backgroundColor: colors.cardDisabled },
    retryText: {
      color: colors.onCard,
      fontSize: type.label,
      lineHeight: lineHeight.label,
      fontWeight: weight.medium,
    },
  });
