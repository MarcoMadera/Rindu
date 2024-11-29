export enum LineType {
  FIRST = "first",
  CURRENT = "current",
  PREVIOUS = "previous",
  NEXT = "next",
}

export interface IAllLines {
  color: string;
  text: string;
  type: LineType;
}

export interface IlrclibResponse {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

export interface ILyrics {
  lyrics: {
    syncType: "LINE_SYNCED" | "UNSYNCED";
    lines: {
      startTimeMs: string;
      words: string;
      syllables: string[];
      endTimeMs: string;
    }[];
    provider: string;
    providerLyricsId: string;
    providerDisplayName: string;
    syncLyricsUri: string;
    isDenseTypeface: boolean;
    alternatives: string[];
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

export enum LyricsAction {
  Fullscreen = "FULLSCREEN_LYRICS",
  LoadTrackPage = "LOAD_TRACK_PAGE",
}

interface ILegacyLyrics {
  lyrics: string | null;
  isFullscreen: false;
}

export type GetLyrics =
  | ILegacyLyrics
  | (ILyrics & { isFullscreen: true })
  | null;

export interface IFormatLyricsResponse {
  colors?: ILyrics["colors"];
  lines: {
    startTimeMs?: string;
    words: string;
    syllables?: string[];
    endTimeMs?: string;
  }[];
  provider: ILyrics["lyrics"]["provider"];
  syncType: ILyrics["lyrics"]["syncType"];
}
