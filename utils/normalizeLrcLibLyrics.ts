import { MILLISECONDS } from "./constants";
import { IlrclibResponse, ILyrics } from "types/lyrics";

function convertTimestampToMs(
  minutes: string,
  seconds: string,
  centiseconds: string
): number {
  return (
    parseInt(minutes) * MILLISECONDS.MINUTE +
    parseInt(seconds) * MILLISECONDS.SECOND +
    parseInt(centiseconds) * MILLISECONDS.CENTISECOND
  );
}

function parseSyncedLyrics(
  syncedLyrics: IlrclibResponse["syncedLyrics"]
): ILyrics["lyrics"]["lines"] {
  const lines = syncedLyrics?.split("\n").filter((line) => line.trim());
  const mappedLines = lines?.map((line, index, array) => {
    const timeMatch = RegExp(/\[(\d{2}):(\d{2})\.(\d{2})\]/).exec(line);
    if (!timeMatch) return null;

    const [, minutes, seconds, centiseconds] = timeMatch;
    const startTimeMs = convertTimestampToMs(
      minutes,
      seconds,
      centiseconds
    ).toString();

    let endTimeMs = startTimeMs;
    if (index < array.length - 1) {
      const nextTimeMatch = RegExp(/\[(\d{2}):(\d{2})\.(\d{2})\]/).exec(
        array[index + 1]
      );
      if (nextTimeMatch) {
        const [, nextMin, nextSec, nextCent] = nextTimeMatch;
        endTimeMs = convertTimestampToMs(nextMin, nextSec, nextCent).toString();
      }
    } else {
      endTimeMs = (parseInt(startTimeMs) + 5000).toString();
    }

    const words = line.replace(/\[\d{2}:\d{2}\.\d{2}\]/, "").trim();

    return {
      startTimeMs,
      endTimeMs,
      words,
      syllables: [],
    };
  });

  return (
    mappedLines?.filter(
      (line): line is NonNullable<typeof line> => line !== null
    ) || []
  );
}

function parseUnsyncedLyrics(
  plainLyrics: IlrclibResponse["plainLyrics"]
): ILyrics["lyrics"]["lines"] {
  const lines = plainLyrics?.split("\n").filter((line) => line.trim());

  return (
    lines?.map((line) => ({
      startTimeMs: "0",
      endTimeMs: "0",
      words: line.trim(),
      syllables: [],
    })) || []
  );
}

function getInstrumentalLine(): ILyrics["lyrics"]["lines"] {
  return [
    {
      startTimeMs: "0",
      endTimeMs: "0",
      words: "♪ Instrumental ♪",
      syllables: [],
    },
  ];
}

function getLines(lrclibResponse: IlrclibResponse, hasSync: boolean) {
  if (lrclibResponse.instrumental) {
    return getInstrumentalLine();
  }

  if (hasSync) {
    return parseSyncedLyrics(lrclibResponse.syncedLyrics);
  }

  return parseUnsyncedLyrics(lrclibResponse.plainLyrics);
}

export function normalizeLrcLibLyrics(
  lrclibResponse: IlrclibResponse
): ILyrics {
  const hasSync = !!lrclibResponse.syncedLyrics?.includes("[");
  const syncType = hasSync ? "LINE_SYNCED" : "UNSYNCED";
  const lines = getLines(lrclibResponse, hasSync);

  return {
    lyrics: {
      syncType: syncType,
      lines: lines,
      provider: "lrclib",
      providerLyricsId: lrclibResponse.id.toString(),
      providerDisplayName: "LRCLib",
      syncLyricsUri: `https://lrclib.net/api/get/${lrclibResponse.id}`,
      isDenseTypeface: false,
      alternatives: [],
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
