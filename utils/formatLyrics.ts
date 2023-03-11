import { GetLyrics, ISyncedLyricsResponse } from "./getLyrics";

export interface IFormatLyricsResponse {
  colors?: ISyncedLyricsResponse["colors"];
  lines: {
    startTimeMs?: string;
    words: string;
    syllables?: [];
    endTimeMs?: string;
  }[];
  provider: ISyncedLyricsResponse["lyrics"]["provider"];
  syncType: ISyncedLyricsResponse["lyrics"]["syncType"];
}

export function formatLyrics(
  lyricsData: GetLyrics
): IFormatLyricsResponse | null {
  if (lyricsData?.isFullscreen === undefined) return null;
  if (lyricsData.isFullscreen) {
    return {
      colors: lyricsData.colors,
      lines: lyricsData.lyrics.lines,
      provider: lyricsData.lyrics.provider,
      syncType: lyricsData.lyrics.syncType,
    };
  }

  if (!lyricsData.lyrics) return null;

  const lines: IFormatLyricsResponse["lines"] = lyricsData.lyrics
    .split("\n")
    .map((line) => {
      return { words: line };
    });
  return {
    lines,
    provider: "legacy",
    syncType: "UNSYNCED",
  };
}
