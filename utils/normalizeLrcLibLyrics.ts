interface IlrclibResponse {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string;
}

export interface ILyrics {
  lyrics: {
    syncType: "LINE_SYNCED" | "UNSYNCED";
    lines: {
      startTimeMs: string;
      words: string;
      syllables: readonly [];
      endTimeMs: string;
    }[];
    provider: string;
    providerLyricsId: string;
    providerDisplayName: string;
    syncLyricsUri: string;
    isDenseTypeface: boolean;
    alternatives: readonly [];
    language: string;
    isRtlLanguage: boolean;
    fullscreenAction: string;
  };
  colors: {
    background: number;
    text: number;
    highlightText: number;
  };
  hasVocalRemoval: boolean;
}

function parseSyncedLyrics(syncedLyrics: string): Array<{
  startTimeMs: string;
  words: string;
  syllables: readonly [];
  endTimeMs: string;
}> {
  const lines = syncedLyrics.split("\n").filter((line) => line.trim());
  return lines
    .map((line, index, array) => {
      const timeMatch = RegExp(/\[(\d{2}):(\d{2})\.(\d{2})\]/).exec(line);
      if (!timeMatch) return null;

      const [, minutes, seconds, centiseconds] = timeMatch;
      const startTimeMs = (
        parseInt(minutes) * 60000 +
        parseInt(seconds) * 1000 +
        parseInt(centiseconds) * 10
      ).toString();

      let endTimeMs = startTimeMs;
      if (index < array.length - 1) {
        const nextTimeMatch = RegExp(/\[(\d{2}):(\d{2})\.(\d{2})\]/).exec(
          array[index + 1]
        );
        if (nextTimeMatch) {
          const [, nextMin, nextSec, nextCent] = nextTimeMatch;
          endTimeMs = (
            parseInt(nextMin) * 60000 +
            parseInt(nextSec) * 1000 +
            parseInt(nextCent) * 10
          ).toString();
        }
      } else {
        endTimeMs = (parseInt(startTimeMs) + 5000).toString();
      }

      const words = line.replace(/\[\d{2}:\d{2}\.\d{2}\]/, "").trim();

      return {
        startTimeMs,
        endTimeMs,
        words,
        syllables: [] as const,
      };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);
}

export function normalizeLrcLibLyrics(
  lrclibResponse: IlrclibResponse
): ILyrics {
  const hasSync = lrclibResponse.syncedLyrics.includes("[");

  return {
    lyrics: {
      syncType: hasSync ? "LINE_SYNCED" : "UNSYNCED",
      lines: hasSync
        ? parseSyncedLyrics(lrclibResponse.syncedLyrics)
        : [
            {
              startTimeMs: "0",
              endTimeMs: (lrclibResponse.duration * 1000).toString(),
              words: lrclibResponse.plainLyrics,
              syllables: [] as const,
            },
          ],
      provider: "lrclib",
      providerLyricsId: lrclibResponse.id.toString(),
      providerDisplayName: "LRCLib",
      syncLyricsUri: `https://lrclib.net/api/lyrics/${lrclibResponse.id}`,
      isDenseTypeface: false,
      alternatives: [] as const,
      language: "en",
      isRtlLanguage: false,
      fullscreenAction: "FULLSCREEN_LYRICS",
    },
    colors: {
      background: -9013642,
      text: -16777216,
      highlightText: -1,
    },
    hasVocalRemoval: false,
  };
}
