import {
  MutableRefObject,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { LoadingSpinner } from "components";
import { PictureInPicture } from "components/icons";
import {
  useAuth,
  useHeader,
  useLyrics,
  useSpotify,
  useToast,
  useTranslations,
} from "hooks";
import { DisplayInFullScreen } from "types/spotify";
import {
  colorCodedToHex,
  colorCodedToRGB,
  getAllLinesFittingWidth,
  getLineType,
  getRandomColor,
  hexToHsl,
  IFormatLyricsResponse,
  rgbToHex,
  ToastMessage,
} from "utils";

interface FullScreenLyricsProps {
  appRef?: MutableRefObject<HTMLDivElement | undefined>;
}

interface ILyricLineProps {
  line: IFormatLyricsResponse["lines"][0];
  lyricsProgressMs: number;
  lyrics: IFormatLyricsResponse;
  type: "current" | "previous" | "next";
  lyricLineColor: string;
  lyricTextColor: string;
}

function LyricLine({
  line,
  lyricsProgressMs,
  lyrics,
  type,
  lyricLineColor,
  lyricTextColor,
}: ILyricLineProps) {
  const { player } = useSpotify();
  const { user } = useAuth();
  const isPremium = user?.product === "premium";
  const lineRef = useRef<HTMLButtonElement>(null);

  const lineColors = {
    current: "#fff",
    previous: lyricLineColor + "80",
    next: lyricTextColor,
  };

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const currentLine = line.classList.contains("current");
    if (currentLine) {
      line.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [lyricsProgressMs]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (
          isPremium &&
          line?.startTimeMs &&
          player &&
          lyrics.syncType === "LINE_SYNCED"
        ) {
          player.seek(Number(line.startTimeMs));
        }
      }}
      className={`line ${type}`}
      dir="auto"
      ref={lineRef}
    >
      {line.words}
      <style jsx>{`
        .line {
          display: block;
          color: ${lyricTextColor};
          background-color: transparent;
          border: none;
          width: 100%;
          text-align: left;
          padding-left: 144px;
        }
        .line.current {
          color: ${lineColors.current};
        }
        .line.previous {
          color: ${lineColors.previous};
        }
        .line.next {
          color: ${lineColors.next};
        }
        .line:hover {
          color: ${lyrics?.colors ? lyricLineColor : "#fff"};
          opacity: 1;
        }
        @media (max-width: 768px) {
          .line {
            padding-left: 0;
          }
        }
        @media (max-width: 658px) {
          .line {
            padding-left: 0;
          }
        }
        .line {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 54px;
          cursor: pointer;
          transition: all 0.1s ease-out 0s;
        }
      `}</style>
    </button>
  );
}

export default function FullScreenLyrics({
  appRef,
}: FullScreenLyricsProps): ReactElement {
  const {
    currentlyPlaying,
    setDisplayInFullScreen,
    currentlyPlayingDuration,
    isPlaying,
    player,
    pictureInPictureCanvas,
    setIsPictureInPictureLyircsCanvas,
    isPictureInPictureLyircsCanvas,
    videoRef,
    isPip,
    setIsPip,
  } = useSpotify();
  const { accessToken, user } = useAuth();
  const [lyricsProgressMs, setLyricsProgressMs] = useState(0);
  const [lyricLineColor, setLyricLineColor] = useState<string>("#fff");
  const [lyricTextColor, setLyricTextColor] = useState<string>("#fff");
  const [lyricsBackgroundColor, setLyricsBackgroundColor] = useState<
    string | undefined
  >();
  const { lyrics, lyricsError, lyricsLoading } = useLyrics({
    artist: currentlyPlaying?.artists?.[0]?.name,
    title: currentlyPlaying?.name,
    trackId: currentlyPlaying?.id,
    accessToken: accessToken,
  });
  const { translations } = useTranslations();
  const isPremium = user?.product === "premium";
  const { addToast } = useToast();
  const title = currentlyPlaying?.name ?? "";
  const artist = currentlyPlaying?.artists?.[0]?.name ?? "";
  const album = currentlyPlaying?.album?.name ?? "";
  const cover = currentlyPlaying?.album?.images?.[0]?.url ?? "";

  useHeader({
    disableOpacityChange: true,
    alwaysDisplayColor: false,
    showOnFixed: false,
    disableBackground: true,
  });

  useEffect(() => {
    if (!isPremium) return;
    (player as Spotify.Player).getCurrentState().then((state) => {
      if (state) {
        setLyricsProgressMs(state.position);
      }
    });

    (player as Spotify.Player).on("player_state_changed", (state) => {
      if (state) {
        setLyricsProgressMs(state.position);
      }
    });
  }, [player, isPremium]);

  useLayoutEffect(() => {
    const app = appRef?.current;
    const newLyricsBackgroundColor = lyrics?.colors?.background
      ? rgbToHex(colorCodedToRGB(lyrics.colors.background))
      : lyricsBackgroundColor ?? getRandomColor();
    const [h, s, l] = hexToHsl(newLyricsBackgroundColor, true) ?? [];
    setLyricLineColor(
      lyrics?.colors?.highlightText
        ? colorCodedToHex(lyrics.colors.highlightText)
        : lyricLineColor ?? `hsl(${h}, ${s}%, ${l - 20}%)`
    );
    setLyricTextColor(
      lyrics?.colors?.text
        ? rgbToHex(colorCodedToRGB(lyrics.colors.text))
        : lyricTextColor ?? `hsl(${h}, ${s}%, ${l - 20}%)`
    );

    if (currentlyPlaying?.type !== "track" || !app)
      return setDisplayInFullScreen(DisplayInFullScreen.App);
    app.style.backgroundColor = newLyricsBackgroundColor;
    setLyricsBackgroundColor(newLyricsBackgroundColor);
    return () => {
      app.style.backgroundColor = "inherit";
    };
  }, [
    appRef,
    lyricsBackgroundColor,
    lyricLineColor,
    lyricTextColor,
    currentlyPlaying?.type,
    lyrics?.colors?.background,
    lyrics?.colors?.highlightText,
    lyrics?.colors?.text,
    setDisplayInFullScreen,
  ]);

  useEffect(() => {
    if (!isPlaying || !currentlyPlayingDuration) {
      return;
    }
    const minimumIntervalCheck = 200;
    const playerCallBackInterval = setInterval(() => {
      setLyricsProgressMs((value) =>
        value >= currentlyPlayingDuration ? 0 : value + minimumIntervalCheck
      );
    }, minimumIntervalCheck);

    return () => {
      clearInterval(playerCallBackInterval);
    };
  }, [setLyricsProgressMs, isPlaying, currentlyPlayingDuration]);

  useEffect(() => {
    if (!isPictureInPictureLyircsCanvas || !pictureInPictureCanvas.current)
      return;
    const lines = lyrics?.lines;
    const ctx = pictureInPictureCanvas.current.getContext("2d");
    const canvasWidth = pictureInPictureCanvas.current.width;
    const canvasHeight = pictureInPictureCanvas.current.height;
    const LYRICS_PIP_HEADER_HEIGH = 100;
    if (!ctx) return;
    const lyricsContainerHeight = canvasHeight - LYRICS_PIP_HEADER_HEIGH;

    ctx.clearRect(0, 100, canvasWidth, lyricsContainerHeight);
    ctx.font = "24px Arial";

    const canvasMiddle = lyricsContainerHeight / 2;
    if (lyricsError || !lines) {
      ctx.fillStyle = lyricTextColor;
      ctx.fillText(lyricsError ?? "", 10, canvasMiddle);
    }

    const LINE_HEIGHT = 40;
    const allLines = getAllLinesFittingWidth({
      ctx,
      lines: lines || [],
      lyricLineColor,
      lyricsProgressMs,
      lyricTextColor,
      canvasWidth,
    });

    const currentLineIndex = allLines.findIndex(
      (line) => line.type === "current"
    );

    allLines.forEach((line, index) => {
      const FIRST_LINES_TO_MIDDLE = 5;
      const LAST_LINES_TO_MIDDLE = 7;
      const isOneOfFirstLines = currentLineIndex < FIRST_LINES_TO_MIDDLE;
      const isOfLastLines =
        currentLineIndex > allLines.length - LAST_LINES_TO_MIDDLE;
      const bottomLineTrace = isOfLastLines
        ? lyricsContainerHeight +
          LINE_HEIGHT +
          10 -
          LINE_HEIGHT * (allLines.length - currentLineIndex)
        : canvasMiddle;
      const middleHeight = isOneOfFirstLines
        ? canvasMiddle - LINE_HEIGHT * (4 - currentLineIndex)
        : bottomLineTrace;

      const lineY =
        LYRICS_PIP_HEADER_HEIGH +
        middleHeight +
        LINE_HEIGHT * (index - currentLineIndex);
      ctx.fillStyle = line.color ?? "#fff";
      const limit = LINE_HEIGHT + LYRICS_PIP_HEADER_HEIGH;
      const isOutsideCanvas =
        lineY < limit || lineY > lyricsContainerHeight + limit;
      if (isOutsideCanvas) return;
      ctx.fillText(line.text, 10, lineY);
    });

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = lyricsBackgroundColor ?? "#000";

    ctx.fillRect(
      0,
      0,
      pictureInPictureCanvas.current.width,
      pictureInPictureCanvas.current.height
    );
  }, [
    lyricsError,
    lyricsProgressMs,
    isPictureInPictureLyircsCanvas,
    lyricLineColor,
    lyricTextColor,
    lyricsBackgroundColor,
    pictureInPictureCanvas,
    lyrics?.lines,
  ]);

  useEffect(() => {
    if (!isPictureInPictureLyircsCanvas || !pictureInPictureCanvas.current)
      return;
    const ctx = pictureInPictureCanvas.current.getContext("2d");
    if (!ctx) {
      return;
    }
    const drawImage = async (url: string) => {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = url;
      await image.decode();
      ctx?.clearRect(10, 10, 80, 80);
      ctx?.drawImage(image, 10, 10, 80, 80);
    };
    ctx.clearRect(0, 0, 10, 100);
    ctx.clearRect(10, 90, pictureInPictureCanvas.current.width, 10);
    ctx.clearRect(0, 0, pictureInPictureCanvas.current.width, 10);
    ctx.clearRect(90, 0, pictureInPictureCanvas.current.width - 90, 100);

    ctx.font = "22px Arial";
    ctx.fillStyle = lyricTextColor;
    ctx.fillText(title, 100, 30);
    ctx.font = "18px Arial";
    ctx.fillText(artist, 100, 60);
    ctx.font = "16px Arial";
    ctx.fillText(album, 100, 90);
    if (cover) {
      drawImage(cover);
    } else {
      ctx.clearRect(10, 10, 80, 80);
    }

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = lyricsBackgroundColor || "#000";

    ctx.fillRect(
      0,
      0,
      pictureInPictureCanvas.current.width,
      pictureInPictureCanvas.current.height
    );
  }, [
    lyricsBackgroundColor,
    title,
    artist,
    album,
    cover,
    isPictureInPictureLyircsCanvas,
    lyrics,
    pictureInPictureCanvas,
    lyricTextColor,
  ]);

  return (
    <div className="lyrics-container">
      {!lyrics ? (
        <div className="message-container">
          {lyricsLoading && <LoadingSpinner />}
          {lyricsError && !lyricsLoading && (
            <div className="lyrics-error">
              <p>{lyricsError}</p>
            </div>
          )}
        </div>
      ) : null}
      {lyrics && lyrics.lines.length > 0 && (
        <div className="lyrics">
          {lyrics.lines.map((line, i) => {
            const type = getLineType({
              currentLine: line,
              lyricsProgressMs,
              nextLine: lyrics.lines[i + 1],
            });

            return (
              <LyricLine
                line={line}
                lyrics={lyrics}
                lyricsProgressMs={lyricsProgressMs}
                type={type}
                lyricLineColor={lyricLineColor}
                lyricTextColor={lyricTextColor}
                key={i}
              />
            );
          })}
        </div>
      )}
      {!!document?.pictureInPictureEnabled && (
        <button
          className="lyrics-pip-button"
          onClick={async (e) => {
            e.stopPropagation();
            if (!isPremium) {
              addToast({
                variant: "error",
                message: translations[ToastMessage.PremiumRequired],
              });
            }
            if (!lyrics) {
              addToast({
                variant: "error",
                message: translations[ToastMessage.NoLyricsToDisplay],
              });
              return;
            }
            if (
              isPictureInPictureLyircsCanvas &&
              document.pictureInPictureElement
            ) {
              await document.exitPictureInPicture();
              setIsPictureInPictureLyircsCanvas.off();
              setIsPip(false);
              return;
            }
            setIsPictureInPictureLyircsCanvas.on();
            setIsPip(true);
            await videoRef.current?.play();
            await videoRef.current?.requestPictureInPicture();
          }}
        >
          <PictureInPicture />
        </button>
      )}
      <style jsx>{`
        :global(.app) {
          position: relative;
        }
        :global(body .app:fullscreen .back-to-player) {
          display: block;
        }
        .lyrics-pip-button {
          position: fixed;
          top: calc(100% - 150px);
          transform: translateY(-50%);
          right: 30px;
          width: 40px;
          height: 40px;
          margin: 0 0 0 32px;
          z-index: 999999999999900;
          padding: 10px;
          cursor: pointer;
          color: ${isPip && isPictureInPictureLyircsCanvas
            ? "#1db954"
            : "#ffffffb3"};
          --border-width: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Lato, sans-serif;
          font-size: 2.5rem;
          text-transform: uppercase;
          background: ${lyricsBackgroundColor || "transparent"};
          border: none;
        }
        .lyrics-pip-button:hover {
          filter: brightness(1.2);
        }
        .lyrics-pip-button::after {
          position: absolute;
          content: "";
          top: calc(-1 * var(--border-width));
          left: calc(-1 * var(--border-width));
          z-index: -1;
          width: calc(100% + var(--border-width) * 2);
          height: calc(100% + var(--border-width) * 2);
          background: linear-gradient(
            60deg,
            ${lyricsBackgroundColor || "transparent"} 0%,
            #ffffff80 50%,
            ${lyricsBackgroundColor || "transparent"} 100%
          );
          background-size: 300% 300%;
          background-position: 0 50%;
          border-radius: calc(2 * var(--border-width));
          animation: moveGradient 4s alternate infinite;
        }
        @keyframes moveGradient {
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      <style jsx>{`
        .lyrics-container {
          width: 100%;
          display: flex;
          min-width: calc(100% - 128px);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 42px;
          max-width: max-content;
          position: sticky;
          top: 0;
        }
        @media (max-width: 768px) {
          .lyrics-container {
            margin: 0px 64px;
            font-size: 24px;
          }
          .line {
            padding-left: 0;
          }
        }
        @media (max-width: 658px) {
          .lyrics-container {
            margin: 0px;
            font-size: 18px;
          }
          .line {
            padding-left: 0;
          }
        }
        .message-container {
          width: 100%;
          height: calc((var(--vh, 1vh) * 100) - 90px - 60px);
        }
        .line {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 54px;
          cursor: pointer;
          transition: all 0.1s ease-out 0s;
        }
        .lyrics {
          font-size: 2rem;
          color: #fff;
          padding: 1rem;
        }
        .lyrics-error {
          font-size: 2rem;
          color: #fff;
          text-align: center;
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        @media screen and (max-width: 1000px) {
          div.lyrics-container .lyrics-pip-button {
            top: calc(100% - 200px);
          }
        }
      `}</style>
    </div>
  );
}
