import useHeader from "hooks/useHeader";
import useLyrics from "hooks/useLyrics";
import useSpotify from "hooks/useSpotify";
import {
  MutableRefObject,
  ReactElement,
  useLayoutEffect,
  useState,
} from "react";
import { getRandomColor } from "utils/colors";
import { hexToHsl } from "utils/hexToHsl";
import { LoadingSpinner } from "./LoadingSpinner";

interface FullScreenLyricsProps {
  appRef?: MutableRefObject<HTMLDivElement | undefined>;
}

export default function FullScreenLyrics({
  appRef,
}: FullScreenLyricsProps): ReactElement {
  const { currrentlyPlaying, setShowLyrics } = useSpotify();
  const [lyricLineColor, setLyricLineColor] = useState<string>("#fff");
  const { lyrics, lyricsError, lyricsLoading } = useLyrics({
    artist: currrentlyPlaying?.artists?.[0]?.name,
    title: currrentlyPlaying?.name,
  });

  useHeader({
    disableOpacityChange: true,
    alwaysDisplayColor: false,
    showOnFixed: false,
    disableBackground: true,
  });

  useLayoutEffect(() => {
    const lyricsBackgroundColor = getRandomColor();
    const [h, s, l] = hexToHsl(lyricsBackgroundColor, true) || [];
    setLyricLineColor(`hsl(${h}, ${s}%, ${l - 20}%)`);
    const app = appRef?.current;
    if (currrentlyPlaying?.type !== "track" || !app) return setShowLyrics.off();
    const appBackgroundColor: string = app.style.backgroundColor;

    app.style.backgroundColor = lyricsBackgroundColor;

    return () => {
      app.style.backgroundColor = appBackgroundColor;
    };
  }, [appRef, currrentlyPlaying?.type, setShowLyrics]);

  return (
    <div className="lyrics-container">
      {!lyrics.length ? (
        <div className="message-container">
          {lyricsLoading && <LoadingSpinner />}
          {lyricsError && !lyricsLoading && (
            <div className="lyrics-error">
              <p>{lyricsError}</p>
            </div>
          )}
        </div>
      ) : null}
      {lyrics.length > 0 && (
        <div className="lyrics">
          {lyrics.map((line, i) => {
            return (
              <div key={i} className="line">
                {line}
              </div>
            );
          })}
        </div>
      )}
      <style jsx>{`
        .line {
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
          margin: 0px 144px;
          max-width: max-content;
        }
        @media (max-width: 768px) {
          .lyrics-container {
            margin: 0px 64px;
            font-size: 24px;
          }
        }
        @media (max-width: 658px) {
          .lyrics-container {
            margin: 0px;
            font-size: 18px;
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
        .line {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 54px;
          cursor: pointer;
          transition: all 0.1s ease-out 0s;
        }
        .lyrics .line:hover {
          color: #fff;
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
