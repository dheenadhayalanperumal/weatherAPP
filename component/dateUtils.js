// `new Date("2026-08-05")` parses as UTC midnight but `toLocaleDateString`
// formats in local time, so every row rendered as the previous day for any user
// west of UTC. Parsing the components explicitly yields local midnight.
export const parseLocalDate = (isoDate) => {
  if (typeof isoDate !== "string") return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

// "Today" for the first row, otherwise a compact "Wed, Aug 12".
export const formatRowDate = (isoDate, index) => {
  const date = parseLocalDate(isoDate);
  if (!date) return isoDate ?? "";
  if (index === 0) return "Today";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

// The day-detail heading: "Today" or the full weekday name.
export const formatWeekday = (isoDate, index) => {
  const date = parseLocalDate(isoDate);
  if (index === 0) return "Today";
  if (!date) return isoDate ?? "";
  return date.toLocaleDateString(undefined, { weekday: "long" });
};

// The day-detail subheading: "12 August 2026".
export const formatLongDate = (isoDate) => {
  const date = parseLocalDate(isoDate);
  if (!date) return isoDate ?? "";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// The API's "HH:MM:SS" is already local to the forecast location, so it is
// formatted in place rather than via the epoch (which would convert it into the
// *device's* timezone). Locale formatting means a US user sees "5:47 AM" rather
// than the raw 24-hour string.
export const formatClockTime = (timeString) => {
  if (typeof timeString !== "string") return "--:--";
  const [hour, minute] = timeString.split(":");
  const h = Number(hour);
  if (!Number.isInteger(h) || minute === undefined) return "--:--";

  return new Date(2000, 0, 1, h, Number(minute) || 0).toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit" }
  );
};
