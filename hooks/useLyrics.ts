import { useEffect, useState } from "react";
import formaLyrics from "utils/formatLyrics";
import { getLyrics } from "utils/getLyrics";
import { within } from "utils/whitin";
import useToggle from "./useToggle";

export default function useLyrics({
  artist,
  title,
}: {
  artist?: string;
  title?: string;
}): {
  lyrics: string[];
  lyricsLoading: boolean;
  lyricsError: string | null;
} {
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [lyricsLoading, setLoading] = useToggle();
  const [lyricsError, setLyricsError] = useState<string | null>(null);
  const [res, setRes] = useState<{
    error: string | null;
    id?: string | null;
    data: string | null;
  }>({ error: null, data: null, id: null });

  useEffect(() => {
    setLoading.on();
    setLyricsError(null);
    setLyrics([]);
    setRes({ error: null, data: null, id: null });

    if (!artist || !title) {
      setLyrics([]);
      setLoading.off();
      setLyricsError("No artist or title provided");
      return;
    }

    within(getLyrics(artist, title), 40000, artist + title).then((res) => {
      if (res) {
        setRes(res);
      }
    });

    return () => {
      setLyrics([]);
      setLoading.reset();
      setLyricsError(null);
    };
  }, [artist, setLoading, setLyricsError, title]);

  useEffect(() => {
    if (!res || !artist || !title || res.id !== artist + title) return;
    if (res.error === "timeout") {
      setLyricsError(
        "Sorry, This seems to be very slow and we don't want to make you wait more"
      );
      setLoading.off();
      setLyrics([]);
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
