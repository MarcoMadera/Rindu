import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { useLyrics, useLyricsInPictureInPicture, useSpotify } from "hooks";
import { DisplayInFullScreen } from "types/spotify";
import { getRandomColor, IFormatLyricsResponse } from "utils";

export interface ILyricsContext {
  lyricsProgressMs: number;
  lyricTextColor: string;
  lyricsBackgroundColor: string;
  lyricLineColor: string;
  lyrics: IFormatLyricsResponse | null;
  lyricsError: string | null;
  lyricsLoading: boolean;
  setLyricsProgressMs: Dispatch<SetStateAction<number>>;
  setLyricLineColor: Dispatch<SetStateAction<string>>;
  setLyricTextColor: Dispatch<SetStateAction<string>>;
  setLyricsBackgroundColor: Dispatch<SetStateAction<string>>;
}

const LyricsContext = createContext<ILyricsContext | undefined>(undefined);

export function LyricsContextContextProvider({
  children,
}: Readonly<PropsWithChildren>): ReactElement {
  const { displayInFullScreen, isPictureInPictureLyircsCanvas } = useSpotify();
  const [lyricsProgressMs, setLyricsProgressMs] = useState(0);
  const [lyricLineColor, setLyricLineColor] = useState<string>("#fff");
  const [lyricTextColor, setLyricTextColor] = useState<string>("#fff");
  const [lyricsBackgroundColor, setLyricsBackgroundColor] =
    useState<string>(getRandomColor());
  const requestLyrics = !!(
    displayInFullScreen === DisplayInFullScreen.Lyrics ||
    (isPictureInPictureLyircsCanvas && document.pictureInPictureElement)
  );

  const { lyrics, lyricsError, lyricsLoading } = useLyrics({
    requestLyrics,
  });

  useLyricsInPictureInPicture({
    setLyricsProgressMs,
    setLyricLineColor,
    setLyricTextColor,
    lyrics,
    lyricsBackgroundColor,
    setLyricsBackgroundColor,
    lyricTextColor,
    lyricLineColor,
    lyricsProgressMs,
    lyricsError,
    requestLyrics,
  });

  const value = useMemo(
    () => ({
      lyricsProgressMs,
      lyricLineColor,
      lyricTextColor,
      lyricsBackgroundColor,
      lyrics,
      lyricsError,
      lyricsLoading,
      setLyricsProgressMs,
      setLyricLineColor,
      setLyricTextColor,
      setLyricsBackgroundColor,
    }),
    [
      lyricsProgressMs,
      lyricLineColor,
      lyricTextColor,
      lyricsBackgroundColor,
      lyrics,
      lyricsError,
      lyricsLoading,
    ]
  );

  return (
    <LyricsContext.Provider value={value}>{children}</LyricsContext.Provider>
  );
}

export default LyricsContext;
