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

  useEffect(() => {
    setLoading.on();
    setLyricsError(null);
    setLyrics([]);

    if (!artist || !title) {
      setLyrics([]);
      setLoading.off();
      setLyricsError("No artist or title provided");
      return;
    }

    within(getLyrics(artist, title), 40000)
      .then((res) => {
        if (res.data) return setLyrics(formaLyrics(res.data));
        if (res.error === "timeout") {
          setLyricsError(
            "Sorry, This seems to be very slow and we don't want to make you wait more"
          );
        } else {
          setLyricsError("No lyrics found");
        }
        setLyrics([]);
      })
      .finally(() => setLoading.off());

    return () => {
      setLyrics([]);
      setLoading.reset();
      setLyricsError(null);
    };
  }, [artist, setLoading, setLyricsError, title]);

  return {
    lyrics,
    lyricsLoading,
    lyricsError,
  };
}
