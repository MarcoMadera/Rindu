import { timeStringToSeconds } from "./timeStringToSeconds";

interface SpotifyEmbedUrlParams {
  type: string;
  id: string;
  hasTimeStampChanged: boolean;
  timeStamp?: string;
  theme?: string | null;
}

function getTime(timeStamp: string): string {
  try {
    const time = timeStringToSeconds(timeStamp).toString();
    return time;
  } catch {
    return "";
  }
}

export function createSpotifyEmbedUrl({
  type,
  id,
  hasTimeStampChanged,
  timeStamp,
  theme,
}: SpotifyEmbedUrlParams): string {
  const url = new URL(`https://open.spotify.com/embed/${type}/${id}`);
  const params = new URLSearchParams({ utm_source: "generator" });

  if (hasTimeStampChanged && timeStamp !== undefined) {
    const time = getTime(timeStamp);

    if (time) {
      params.append("t", getTime(timeStamp));
    }
  }

  if (theme) {
    params.append("theme", theme);
  }

  url.search = params.toString();

  return url.toString();
}
