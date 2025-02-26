import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { DPIPLyrics, PortalTarget } from "components";
import { useLyrics, useLyricsInPictureInPicture, useSpotify } from "hooks";
import { IFormatLyricsResponse } from "types/lyrics";
import { getRandomColor } from "utils";

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
  const [lyricsProgressMs, setLyricsProgressMs] = useState(0);
  const [lyricLineColor, setLyricLineColor] = useState<string>("#ffffff");
  const [lyricTextColor, setLyricTextColor] = useState<string>("#000000");
  const [lyricsBackgroundColor, setLyricsBackgroundColor] =
    useState<string>(getRandomColor());

  const { lyrics, lyricsError, lyricsLoading } = useLyrics();
  const { pipWindow, isPictureInPictureLyircsCanvas } = useSpotify();

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
    <LyricsContext.Provider value={value}>
      {children}
      {pipWindow.current && isPictureInPictureLyircsCanvas ? (
        <PortalTarget targetId={pipWindow.current?.document.body}>
          <DPIPLyrics />
        </PortalTarget>
      ) : null}
    </LyricsContext.Provider>
  );
}

export default LyricsContext;
