import { useEffect, useState } from "react";

import { useAuth, useSpotify, useToggle } from "hooks";
import {
  formatLyrics,
  getLyrics,
  GetLyrics,
  IFormatLyricsResponse,
  LyricsAction,
  within,
} from "utils";

export function useLyrics({ requestLyrics }: { requestLyrics: boolean }): {
  lyrics: IFormatLyricsResponse | null;
  lyricsLoading: boolean;
  lyricsError: string | null;
} {
  const { currentlyPlaying } = useSpotify();
  const [lyrics, setLyrics] = useState<IFormatLyricsResponse | null>(null);
  const [lyricsLoading, setLoading] = useToggle();
  const [lyricsError, setLyricsError] = useState<string | null>(null);
  const [res, setRes] = useState<{
    error: string | null;
    id?: string | null;
    data: GetLyrics;
  }>({ error: null, data: null, id: null });
  const { accessToken } = useAuth();
  const artist = currentlyPlaying?.artists?.[0].name;
  const title = currentlyPlaying?.name;
  const trackId = currentlyPlaying?.id;

  useEffect(() => {
    if (!requestLyrics) return;
    setLoading.on();
    setLyricsError(null);
    setLyrics(null);
    setRes({ error: null, data: null, id: null });

    if (!artist || !title) {
      setLyrics(null);
      setLoading.off();
      setLyricsError("No artist or title provided");
      return;
    }

    within(
      getLyrics(artist, title, trackId, LyricsAction.Fullscreen),
      40000,
      artist + title
    ).then((res) => {
      if (res) {
        setRes(res);
      }
    });

    return () => {
      setLyrics(null);
      setLoading.reset();
      setLyricsError(null);
    };
  }, [
    accessToken,
    artist,
    setLoading,
    setLyricsError,
    title,
    trackId,
    requestLyrics,
  ]);

  useEffect(() => {
    if (!requestLyrics) return;
    if (!res || !artist || !title || res.id !== artist + title) return;
    if (res.error === "timeout") {
      setLyricsError(
        "Sorry, This seems to be very slow and we don't want to make you wait more"
      );
      setLoading.off();
      setLyrics(null);
      return;
    }

    if (!res.error) {
      setLoading.on();
    }

    setLoading.off();

    if (!res.data) {
      setLyricsError("No lyrics found");
      return;
    }

    setLyricsError(null);
    setLyrics(formatLyrics(res.data));
  }, [artist, res, setLoading, title, requestLyrics]);

  return {
    lyrics,
    lyricsLoading,
    lyricsError,
  };
}
