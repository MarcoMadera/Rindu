import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  RefObject,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { DPIPLyrics, PortalTarget } from "components";
import {
  useLyrics,
  useLyricsInPictureInPicture,
  useMediaSession,
  useSpotify,
} from "hooks";
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
  registerContainer: (ref: RefObject<HTMLDivElement | null>) => void;
  syncLyricsLine: () => void;
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
  const {
    pipWindow,
    isPictureInPictureLyircsCanvas,
    currentlyPlaying,
    currentlyPlayingPosition,
    player,
    isPlaying,
    setIsPlaying,
    videoRef,
    pictureInPictureCanvas,
  } = useSpotify();

  const containersRef = useRef<Set<React.RefObject<HTMLDivElement | null>>>(
    new Set()
  );

  const registerContainer = useCallback(
    (ref: RefObject<HTMLDivElement | null>) => {
      containersRef.current.add(ref);

      return () => {
        containersRef.current.delete(ref);
      };
    },
    []
  );

  const syncLyricsLine = useCallback(() => {
    const observer = new MutationObserver((_, observer) => {
      for (const container of containersRef.current) {
        const currentContainer = container.current;

        if (!currentContainer) return;
        const currentLine = currentContainer.querySelector(".line.current");
        const firstLine = currentContainer.querySelector(".line.first");
        const noLine = currentContainer.querySelector(
          ".line.previous:last-of-type"
        );
        const currentElement = currentLine ?? firstLine ?? noLine;

        if (currentElement) {
          observer.disconnect();
          currentElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    });

    containersRef.current.forEach((container) => {
      if (!container.current) return;
      observer.observe(container.current, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      });
    });
  }, []);

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
  useMediaSession({
    currentlyPlaying,
    currentlyPlayingPosition,
    player,
    isPlaying,
    setIsPlaying,
    videoRef,
    pictureInPictureCanvas,
    isPictureInPictureLyircsCanvas,
    syncLyricsLine,
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
      syncLyricsLine,
      registerContainer,
    }),
    [
      lyricsProgressMs,
      lyricLineColor,
      lyricTextColor,
      lyricsBackgroundColor,
      lyrics,
      lyricsError,
      lyricsLoading,
      syncLyricsLine,
      registerContainer,
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
