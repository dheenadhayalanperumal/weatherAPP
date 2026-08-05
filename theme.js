import { useMemo } from "react";
import { useColorScheme } from "react-native";

// Design tokens for True Weather.
//
// Every foreground/background pair below meets WCAG 2.1 AA (>= 4.5:1 for body
// text) in BOTH schemes. The original palette used #00C1F6 cards with white
// text at 2.11:1 and yellow at 1.96:1 — no text in the app passed. Ratios are
// noted per token so they can be re-checked if a colour is ever changed.

export const palettes = {
  light: {
    background: "#CAF4FF",
    // Card surface. Darkened from #00C1F6 so white text clears AA.
    card: "#0074A6",
    // Disabled control surface. A blanket `opacity: 0.5` over the live card
    // colour composited white-on-blue down to about 2.1:1, and the search
    // button is disabled on first launch, so that was the app's *default*
    // state rather than an edge case.
    cardDisabled: "#4A6B7C",
    surface: "#FFFFFF",

    onCard: "#FFFFFF", //        5.19:1 on card
    onCardMuted: "#E8F6FF", //   4.71:1 on card
    onCardAccent: "#FFF0C2", //  4.57:1 on card — precipitation probability

    heading: "#0B5C86", //       6.19:1 on background
    onSurface: "#0B5C86", //     7.27:1 on surface

    error: "#A3231C", //         6.36:1 on background
  },

  dark: {
    background: "#0A1620",
    card: "#1D4A61", //          1.92:1 against background
    cardDisabled: "#22323B",
    surface: "#16333F",

    onCard: "#FFFFFF", //        9.53:1 on card
    onCardMuted: "#CFE7F3", //   7.43:1 on card
    onCardAccent: "#FFDD93", //  7.27:1 on card

    heading: "#93D6F5", //      11.47:1 on background
    onSurface: "#E0F0F9", //    11.40:1 on surface

    error: "#FF9E96", //         9.21:1 on background
  },
};

// KNOWN-LOW SEPARATIONS, both in the light scheme and both deliberate:
//
//   surface vs background       1.17:1  — white forecast rows on pale blue.
//   cardDisabled vs card        1.10:1  — disabled vs enabled button.
//
// Neither is a WCAG failure. 1.4.3 explicitly exempts disabled controls, and
// 1.4.11 governs controls and meaningful graphics rather than decorative
// fills. Both pairs separate by hue and saturation rather than luminance, and
// the disabled state is additionally exposed non-visually through
// `accessibilityState={{ disabled }}` so it never rests on appearance alone.

export const spacing = { xs: 4, sm: 8, md: 10, lg: 15, xl: 20 };

export const radius = { sm: 8, md: 10 };

// Fixed pixel dimensions, previously scattered as magic numbers across five
// components. Grouping them here is what makes it possible to tell that the
// hourly tile and the metric tile are deliberately the same height.
export const size = {
  iconSm: 30,
  iconMd: 50,
  iconLg: 100,
  tile: 96,
  tileWidth: 80,
  heroCard: 210,
  sunCard: 120,
  buttonWidth: 80,
};

// Minimum interactive target, per Apple HIG and WCAG 2.5.5.
export const MIN_TOUCH_TARGET = 44;

export const type = {
  temp: 36,
  title: 20,
  heading: 18,
  body: 16,
  label: 14,
  caption: 12,
};

// React Native does not derive a line height from the font size, so multi-line
// text defaults to whatever the platform font metrics give — which clips
// descenders on several Android system fonts at the larger sizes.
export const lineHeight = {
  title: 26,
  heading: 24,
  body: 22,
  label: 20,
  caption: 16,
};

// Ceiling on OS font scaling, applied uniformly through <AppText>. It was
// previously set on some components and not others, so at large system font
// sizes the capped and uncapped text scaled apart from each other.
export const MAX_FONT_SCALE = 1.3;

// `fontWeight: "medium"` is not a valid React Native value and silently fell
// back to regular. Numeric weights work on both platforms since RN 0.62, so the
// old `Platform.OS === "android" ? ... : ...` branching is unnecessary.
export const weight = { regular: "400", medium: "500", bold: "700" };

// A black drop shadow does almost nothing against a near-black background, so
// in dark mode the cards are separated by their own lighter surface colour and
// the shadow is dialled back to a rim rather than removed outright.
const shadows = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.36,
    shadowRadius: 3,
    elevation: 3,
  },
  dark: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
};

// Standard Android press feedback. `Pressable`'s opacity change alone is an iOS
// idiom; Android users expect a ripple.
const ripples = {
  light: { color: "rgba(255, 255, 255, 0.24)", borderless: false },
  dark: { color: "rgba(255, 255, 255, 0.16)", borderless: false },
};

// Resolves the active scheme. `useColorScheme` follows the OS setting, which
// requires `"userInterfaceStyle": "automatic"` in app.json — with the previous
// "light" value it would have been pinned to light forever.
export const useTheme = () => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return useMemo(
    () => ({
      scheme,
      isDark: scheme === "dark",
      colors: palettes[scheme],
      cardShadow: shadows[scheme],
      ripple: ripples[scheme],
    }),
    [scheme]
  );
};

// Components declare a module-level `makeStyles(theme)` factory and call this.
// The stylesheet is rebuilt only when the scheme actually flips, so switching
// to dark mode does not cost a StyleSheet.create on every render.
export const useThemedStyles = (factory) => {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
};
