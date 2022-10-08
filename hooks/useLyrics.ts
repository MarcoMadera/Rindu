import { useEffect, useState } from "react";
import formaLyrics, { IFormatLyricsResponse } from "utils/formatLyrics";
import { GetLyrics, getLyrics, LyricsAction } from "utils/getLyrics";
import { within } from "utils/whitin";
import useToggle from "./useToggle";

export default function useLyrics({
  artist,
  title,
  trackId,
  accessToken,
}: {
  artist?: string;
  title?: string;
  trackId?: string | null;
  accessToken?: string;
}): {
  lyrics: IFormatLyricsResponse | null;
  lyricsLoading: boolean;
  lyricsError: string | null;
} {
  const [lyrics, setLyrics] = useState<IFormatLyricsResponse | null>(null);
  const [lyricsLoading, setLoading] = useToggle();
  const [lyricsError, setLyricsError] = useState<string | null>(null);
  const [res, setRes] = useState<{
    error: string | null;
    id?: string | null;
    data: GetLyrics;
  }>({ error: null, data: null, id: null });

  useEffect(() => {
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
      getLyrics(artist, title, trackId, accessToken, LyricsAction.Fullscreen),
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
  }, [accessToken, artist, setLoading, setLyricsError, title, trackId]);

  useEffect(() => {
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
    setLyrics(formaLyrics(res.data));
  }, [artist, res, setLoading, title]);

  return {
    lyrics,
    lyricsLoading,
    lyricsError,
  };
}
