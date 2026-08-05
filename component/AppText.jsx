import React from "react";
import { Text } from "react-native";
import { MAX_FONT_SCALE } from "../theme";

// Every piece of text in the app goes through here so the OS font-scale ceiling
// is applied in exactly one place. Previously `maxFontSizeMultiplier` was set
// on some components and omitted on others, so at large system font sizes the
// capped text stayed put while the uncapped text grew past it and the layouts
// pulled apart.
//
// Callers can still override the cap per instance if they need to.
const AppText = ({ maxFontSizeMultiplier = MAX_FONT_SCALE, ...props }) => (
  <Text maxFontSizeMultiplier={maxFontSizeMultiplier} {...props} />
);

export default AppText;
