import {
  GetLyrics,
  IlrclibResponse,
  ILyrics,
  LyricsAction,
} from "types/lyrics";
import { baseUrl, lyricsApiUrl, normalizeLrcLibLyrics } from "utils";

export async function getLyrics(
  artistName: string,
  title: string,
  trackId?: string | null,
  action?: LyricsAction
): Promise<GetLyrics> {
  if (action === LyricsAction.Fullscreen) {
    if (lyricsApiUrl) {
      const resSyncedLyrics = await fetch(
        lyricsApiUrl ?? `${baseUrl}/api/synced-lyrics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackId }),
        }
      );
      if (resSyncedLyrics.ok) {
        const data = (await resSyncedLyrics.json()) as ILyrics;
        if (data) {
          return { ...data, isFullscreen: true };
        }
      }
    }

    const lrclibRes = await fetch(
      `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artistName)}&track_name=${encodeURIComponent(title)}`
    );

    if (lrclibRes.ok) {
      const data = (await lrclibRes.json()) as IlrclibResponse;
      const nomarlizedData = normalizeLrcLibLyrics(data);
      return {
        ...nomarlizedData,
        isFullscreen: true,
      };
    }
  }

  const res = await fetch(`${baseUrl}/api/lyrics`, {
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
