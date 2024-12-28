const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_MONTH = 2592000;
const SECONDS_IN_YEAR = 31536000;

export function timeSince(date: Date) {
  const now = new Date();
  let seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const yearDiff = Math.floor(seconds / SECONDS_IN_YEAR);
  if (yearDiff >= 1) {
    return yearDiff + ` year${yearDiff > 1 ? "s" : ""}`;
  }

  const monthDiff = Math.floor(seconds / SECONDS_IN_MONTH);
  if (monthDiff >= 1) {
    return monthDiff + ` month${monthDiff > 1 ? "s" : ""}`;
  }

  const dayDiff = Math.floor(seconds / SECONDS_IN_DAY);
  if (dayDiff >= 1) {
    return dayDiff + ` day${dayDiff > 1 ? "s" : ""}`;
  }

  const hourDiff = Math.floor(seconds / SECONDS_IN_HOUR);
  if (hourDiff >= 1) {
    return hourDiff + ` hour${hourDiff > 1 ? "s" : ""}`;
  }

  const minuteDiff = Math.floor(seconds / SECONDS_IN_MINUTE);
  return minuteDiff + ` minute${minuteDiff > 1 ? "s" : ""}`;
}
