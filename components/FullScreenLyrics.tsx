import useAuth from "hooks/useAuth";
import useHeader from "hooks/useHeader";
import useLyrics from "hooks/useLyrics";
import useSpotify from "hooks/useSpotify";
import useToast from "hooks/useToast";
import {
  MutableRefObject,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { DisplayInFullScreen } from "types/spotify";
import { colorCodedToHex, colorCodedToRGB } from "utils/colorCoded";
import { getRandomColor } from "utils/colors";
import { getLinesFittingCanvas } from "utils/getLinesFittingCanvas";
import { hexToHsl } from "utils/hexToHsl";
import { rgbToHex } from "utils/rgbToHex";
import { PictureInPicture } from "./icons/PictureInPicture";
import { LoadingSpinner } from "./LoadingSpinner";

interface FullScreenLyricsProps {
  appRef?: MutableRefObject<HTMLDivElement | undefined>;
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
  const isPremium = user?.product === "premium";
  const { addToast } = useToast();
  const title = currentlyPlaying?.name || "";
  const artist = currentlyPlaying?.artists?.[0]?.name || "";
  const album = currentlyPlaying?.album?.name || "";
  const cover = currentlyPlaying?.album?.images?.[0]?.url || "";

  useHeader({
    disableOpacityChange: true,
    alwaysDisplayColor: false,
    showOnFixed: false,
    disableBackground: true,
  });

  useEffect(() => {
    const currentLine = document.querySelector(".line-current");
    if (currentLine) {
      currentLine.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [lyricsProgressMs]);

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
    const [h, s, l] = hexToHsl(newLyricsBackgroundColor, true) || [];
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
    if (!isPictureInPictureLyircsCanvas) return;
    if (!pictureInPictureCanvas.current) {
      return;
    }
    const lines = document.querySelectorAll(".line");
    const ctx = pictureInPictureCanvas.current.getContext("2d");
    if (!ctx) {
      return;
    }
    const canvasHeight = pictureInPictureCanvas.current.height - 100;

    ctx.clearRect(0, 100, pictureInPictureCanvas.current.width, canvasHeight);
    ctx.font = "24px Arial";

    const canvasMiddle = canvasHeight / 2;
    if (lyricsError) {
      ctx.fillStyle = lyricTextColor;
      ctx.fillText(lyricsError, 10, canvasMiddle);
    }

    const lineHeight = 40;
    const allLines: {
      color: string;
      text: string;
      type: "opaque" | "current" | "normal";
    }[] = [];

    lines.forEach((line) => {
      const isOpaqueLine = line.classList.contains("line-opaque");
      const isCurrentLine = line.classList.contains("line-current");
      const color = isOpaqueLine
        ? lyricTextColor + "80" // 50% opacity
        : isCurrentLine
        ? lyricLineColor
        : lyricTextColor;

      const linesText = getLinesFittingCanvas(
        ctx,
        line.textContent || "",
        (pictureInPictureCanvas.current?.width || 10) - 20
      );
      linesText.forEach((lineText) => {
        allLines.push({
          color,
          text: lineText,
          type: isOpaqueLine ? "opaque" : isCurrentLine ? "current" : "normal",
        });
      });
    });

    const currentLineIndex = allLines.findIndex(
      (line) => line.type === "current"
    );

    allLines.forEach((line, index) => {
      const lineY =
        100 + canvasMiddle + lineHeight * (index - currentLineIndex);
      ctx.fillStyle = line.color;
      const limit = lineHeight + 100;
      const isOutsideCanvas = lineY < limit || lineY > canvasHeight + limit;
      if (isOutsideCanvas) return;
      ctx.fillText(line.text, 10, lineY);
    });

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = lyricsBackgroundColor || "#000";

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
            return (
              <button
                key={i}
                onClick={() => {
                  if (
                    isPremium &&
                    line?.startTimeMs &&
                    player &&
                    lyrics.syncType === "LINE_SYNCED"
                  ) {
                    player.seek(Number(line.startTimeMs));
                  }
                }}
                className={`line line${
                  line.startTimeMs &&
                  Number(line.startTimeMs) <= lyricsProgressMs &&
                  lyrics?.lines[i + 1]?.startTimeMs &&
                  Number(lyrics?.lines[i + 1]?.startTimeMs) >= lyricsProgressMs
                    ? "-current"
                    : Number(line.startTimeMs) <= lyricsProgressMs
                    ? "-opaque"
                    : ""
                }`}
                dir="auto"
              >
                {line.words}
              </button>
            );
          })}
        </div>
      )}
      {!!document?.pictureInPictureEnabled && (
        <button
          className="lyrics-pip-button"
          onClick={async () => {
            if (!isPremium) {
              addToast({
                variant: "error",
                message: "Premium Required",
              });
            }
            if (!lyrics) {
              addToast({
                variant: "error",
                message: "No lyrics to show",
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
        .lyrics-pip-button {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          right: 30px;
          width: 40px;
          height: 40px;
          margin: 0 32px;
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
        .line {
          display: block;
          color: ${lyricTextColor};
          background-color: transparent;
          border: none;
          width: 100%;
          text-align: left;
          padding-left: 144px;
        }
        .line.line-current {
          opacity: 1;
          color: ${lyricLineColor};
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
        .line-opaque {
          opacity: 0.5;
          color: #fff;
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
          height: calc(100vh - 90px - 60px);
        }
        .line,
        .line-opaque,
        .line-current {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 54px;
          cursor: pointer;
          transition: all 0.1s ease-out 0s;
        }
        .lyrics .line:hover,
        .lyrics .line-opaque:hover {
          color: ${lyrics?.colors ? lyricLineColor : "#fff"};
          opacity: 1;
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
      `}</style>
    </div>
  );
}
