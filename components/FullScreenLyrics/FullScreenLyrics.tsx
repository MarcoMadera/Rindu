import { ReactElement, useEffect } from "react";

import css from "styled-jsx/css";

import { lineCss, LyricLine } from "./LyricLine";
import { LoadingSpinner, LyricsPIPButton } from "components";
import { useAuth, useHeader, useLyricsContext } from "hooks";
import { getLineType } from "utils";

const styles1 = css.global`
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
`;
const styles2 = css.global`
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
      var(----lyrics-background-color, transparent) 0%,
      #ffffff80 50%,
      var(----lyrics-background-color, transparent) 100%
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
`;

export default function FullScreenLyrics({
  document = window.document,
}: {
  document?: Document;
}): ReactElement {
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

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--lyrics-background-color",
      `${lyricsBackgroundColor}`
    );
    document.documentElement.style.setProperty(
      "--background-container",
      `${lyricsBackgroundColor}`
    );
  }, [lyricsBackgroundColor, document.documentElement.style]);

  useEffect(() => {
    const pipApp = document.querySelector<HTMLElement>(".pipApp");
    const appContainer = pipApp ?? document.querySelector<HTMLElement>(".app");
    const originalBackground = appContainer?.style?.backgroundColor;
    const originalPosition = appContainer?.style?.position;

    if (appContainer) {
      appContainer.style.backgroundColor = lyricsBackgroundColor;
      appContainer.style.position = "relative";
    }

    return () => {
      if (appContainer) {
        appContainer.style.backgroundColor = originalBackground ?? "";
        appContainer.style.position = originalPosition ?? "";
      }
    };
  }, [document, lyricsBackgroundColor]);

  useEffect(() => {
    const pipApp = document.querySelector<HTMLElement>(".pipApp");

    const pipStyleTag = document.createElement("style");
    const pipStyleTag2 = document.createElement("style");
    const lineStyles = document.createElement("style");

    if (pipApp) {
      pipStyleTag.textContent = styles1 as unknown as string;
      pipStyleTag2.textContent = styles2 as unknown as string;
      lineStyles.textContent = lineCss as unknown as string;
      document.head.appendChild(pipStyleTag);
      document.head.appendChild(pipStyleTag2);
      document.head.appendChild(lineStyles);
    }

    return () => {
      pipStyleTag?.remove();
      pipStyleTag2?.remove();
      lineStyles?.remove();
    };
  }, [document, lyricsBackgroundColor]);

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

            return (
              <LyricLine line={line} type={type} key={i} document={document} />
            );
          })}
        </div>
      )}
      {isPremium &&
        !!document?.pictureInPictureEnabled &&
        !document.querySelector(".pipApp") && (
          <LyricsPIPButton background={lyricsBackgroundColor} />
        )}
      <style jsx global>
        {styles1}
      </style>
      <style jsx global>
        {styles2}
      </style>
    </div>
  );
}
