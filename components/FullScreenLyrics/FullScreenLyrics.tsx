import { ReactElement } from "react";

import { LyricLine } from "./LyricLine";
import { LoadingSpinner, LyricsPIPButton } from "components";
import { useAuth, useHeader, useLyricsContext } from "hooks";
import { getLineType } from "utils";

export default function FullScreenLyrics(): ReactElement {
  const {
    lyricsProgressMs,
    lyricsBackgroundColor,
    lyrics,
    lyricsError,
    lyricsLoading,
  } = useLyricsContext();

  const { isPremium } = useAuth();

  useHeader({
    disableOpacityChange: true,
    alwaysDisplayColor: false,
    showOnFixed: false,
    disableBackground: true,
  });

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
              index: i,
            });

            return <LyricLine line={line} type={type} key={i} />;
          })}
        </div>
      )}
      {isPremium && !!document?.pictureInPictureEnabled && (
        <LyricsPIPButton background={lyricsBackgroundColor} />
      )}
      <style jsx>{`
        :global(.app) {
          background-color: ${lyricsBackgroundColor};
          position: relative;
        }
        .lyrics-container :global(.lyrics-pip-button) {
          position: fixed;
          top: calc(100% - 150px);
          transform: translateY(-50%);
          right: 30px;
          cursor: pointer;
        }
        .lyrics-container :global(.lyrics-pip-button:hover) {
          filter: brightness(1.2);
        }
        .lyrics-container :global(.lyrics-pip-button::after) {
          position: absolute;
          content: "";
          top: calc(-1 * var(--border-width));
          left: calc(-1 * var(--border-width));
          z-index: -1;
          width: calc(100% + var(--border-width) * 2);
          height: calc(100% + var(--border-width) * 2);
          background: linear-gradient(
            60deg,
            ${lyricsBackgroundColor ?? "transparent"} 0%,
            #ffffff80 50%,
            ${lyricsBackgroundColor ?? "transparent"} 100%
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
          margin-top: 60px;
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
            margin: 30px 64px;
            font-size: 24px;
          }
          .line {
            padding-left: 0;
          }
        }
        @media (max-width: 658px) {
          .lyrics-container {
            margin: 30px 0px 0px 0px;
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
          div.lyrics-container :global(.lyrics-pip-button) {
            top: calc(100% - 200px);
          }
        }
      `}</style>
    </div>
  );
}
