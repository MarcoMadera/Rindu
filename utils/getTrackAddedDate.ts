import { ITrack } from "types/spotify";
import { getTimeAgo, Locale } from "utils";

export function getTrackAddedDate(
  trackAddedAtDate: ITrack["added_at"],
  locale: Locale
): string | number | undefined {
  const date = trackAddedAtDate ? +new Date(trackAddedAtDate) : NaN;
  const displayDate = isNaN(date) ? trackAddedAtDate : getTimeAgo(date, locale);
  return displayDate;
}
