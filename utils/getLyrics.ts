import { getSiteUrl } from "utils";

export enum LyricsAction {
  Fullscreen = "FULLSCREEN_LYRICS",
  LoadTrackPage = "LOAD_TRACK_PAGE",
}

export interface ISyncedLyricsResponse {
  lyrics: {
    syncType: "LINE_SYNCED" | "UNSYNCED";
    lines: {
      startTimeMs: string;
      words: string;
      syllables: [];
      endTimeMs: string;
    }[];
    provider: string;
    providerLyricsId: string;
    providerDisplayName: string;
    syncLyricsUri: string;
    isDenseTypeface: boolean;
    alternatives: [];
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

interface ILegacyLyrics {
  lyrics: string | null;
  isFullscreen: false;
}

export type GetLyrics =
  | ILegacyLyrics
  | (ISyncedLyricsResponse & { isFullscreen: true })
  | null;

export async function getLyrics(
  artistName: string,
  title: string,
  trackId?: string | null,
  action?: LyricsAction
): Promise<GetLyrics> {
  if (action === LyricsAction.Fullscreen) {
    const resSyncedLyrics = await fetch(
      process.env.NEXT_PUBLIC_LYRICS_API_URL ??
        `${getSiteUrl()}/api/synced-lyrics`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackId }),
      }
    );
    if (resSyncedLyrics.ok) {
      const data = (await resSyncedLyrics.json()) as ISyncedLyricsResponse;
      if (data) {
        return { ...data, isFullscreen: true };
      }
    }
  }
  const res = await fetch(`${getSiteUrl()}/api/lyrics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ artistName, title }),
  });

  if (res.ok) {
    const lyrics = (await res.json()) as string | null;
    return { lyrics, isFullscreen: false };
  }
  return null;
}
