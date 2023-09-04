import { ReactElement } from "react";

import { LyricLine } from "./LyricLine";
import { LoadingSpinner } from "components";
import { PictureInPicture } from "components/icons";
import {
  useAuth,
  useHeader,
  useLyricsContext,
  useSpotify,
  useToast,
  useTranslations,
} from "hooks";
import { getLineType, ToastMessage } from "utils";

export default function FullScreenLyrics(): ReactElement {
  const {
    setIsPictureInPictureLyircsCanvas,
    isPictureInPictureLyircsCanvas,
    videoRef,
    isPip,
    setIsPip,
  } = useSpotify();
  const {
    lyricsProgressMs,
    lyricsBackgroundColor,
    lyrics,
    lyricsError,
    lyricsLoading,
  } = useLyricsContext();
  const { user } = useAuth();
  const { translations } = useTranslations();
  const isPremium = user?.product === "premium";
  const { addToast } = useToast();

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
            });

            return <LyricLine line={line} type={type} key={i} />;
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