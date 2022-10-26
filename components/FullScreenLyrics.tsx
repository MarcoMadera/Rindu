import useAuth from "hooks/useAuth";
import useHeader from "hooks/useHeader";
import useLyrics from "hooks/useLyrics";
import useSpotify from "hooks/useSpotify";
import {
  MutableRefObject,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { colorCodedToHex, colorCodedToRGB } from "utils/colorCoded";
import { getRandomColor } from "utils/colors";
import { hexToHsl } from "utils/hexToHsl";
import { rgbToHex } from "utils/rgbToHex";
import { LoadingSpinner } from "./LoadingSpinner";

interface FullScreenLyricsProps {
  appRef?: MutableRefObject<HTMLDivElement | undefined>;
}

export default function FullScreenLyrics({
  appRef,
}: FullScreenLyricsProps): ReactElement {
  const {
    currentlyPlaying,
    setShowLyrics,
    currentlyPlayingDuration,
    isPlaying,
    player,
  } = useSpotify();
  const { accessToken, user } = useAuth();
  const [lyricsProgressMs, setLyricsProgressMs] = useState(0);
  const [lyricLineColor, setLyricLineColor] = useState<string>("#fff");
  const [lyricTextColor, setLyricTextColor] = useState<string>("#fff");
  const { lyrics, lyricsError, lyricsLoading } = useLyrics({
    artist: currentlyPlaying?.artists?.[0]?.name,
    title: currentlyPlaying?.name,
    trackId: currentlyPlaying?.id,
    accessToken: accessToken,
  });
  const isPremium = user?.product === "premium";

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
    const lyricsBackgroundColor = lyrics?.colors?.background
      ? rgbToHex(colorCodedToRGB(lyrics.colors.background))
      : getRandomColor();
    const [h, s, l] = hexToHsl(lyricsBackgroundColor, true) || [];
    setLyricLineColor(
      lyrics?.colors?.highlightText
        ? colorCodedToHex(lyrics.colors.highlightText)
        : `hsl(${h}, ${s}%, ${l - 20}%)`
    );
    setLyricTextColor(
      lyrics?.colors?.text
        ? rgbToHex(colorCodedToRGB(lyrics.colors.text))
        : `hsl(${h}, ${s}%, ${l - 20}%)`
    );
    const app = appRef?.current;
    if (currentlyPlaying?.type !== "track" || !app) return setShowLyrics.off();
    const appBackgroundColor: string = app.style.backgroundColor;

    app.style.backgroundColor = lyricsBackgroundColor;

    return () => {
      app.style.backgroundColor = appBackgroundColor;
    };
  }, [
    appRef,
    currentlyPlaying?.type,
    lyrics?.colors?.background,
    lyrics?.colors?.highlightText,
    lyrics?.colors?.text,
    setShowLyrics,
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
      {lyrics && lyrics?.lines.length > 0 && (
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
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
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
