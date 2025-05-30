import { ReactElement, useEffect, useRef, useState } from "react";

import css from "styled-jsx/css";

import { lineCss, LyricLine } from "./LyricLine";
import { CountDown, LoadingSpinner, LyricsPIPButton } from "components";
import { CountDownType } from "components/CountDown";
import { useAuth, useHeader, useLyricsContext, useSpotify } from "hooks";
import { getLineType } from "utils";

const styles1 = css.global`
  .lyrics-container {
    width: 100%;
    display: flex;
    min-width: calc(100% - 128px);
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 42px;
    max-height: 100svh;
    position: sticky;
    min-height: calc(100svh - 60px);
    background: var(--lyrics-background-color);
    z-index: 10;
    margin-top: -60px;
  }
  .message-container {
    width: 100%;
    height: calc(100svh - 90px - 60px);
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
    position: relative;
    gap: 0.5rem;
    padding: 16px;
    padding-top: 136px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height: calc(100svh - 30px);
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
  .lyrics .countdown-container {
    position: absolute;
    top: 76px;
    left: 10rem;
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

  @media screen and (max-width: 768px) {
    .lyrics-container {
      margin: 30px 64px;
      font-size: 24px;
    }
    .line {
      padding-left: 0;
    }
    .lyrics .countdown-container {
      left: calc(50% - 4rem);
      top: -1rem;
      transform: translateX(-50%);
    }
  }

  @media screen and (min-width: 658px) and (display-mode: picture-in-picture) {
    .lyrics-container {
      width: auto;
      margin-right: 0;
    }
    .lyrics {
      padding-right: 5rem;
    }
  }

  @media screen and (min-width: 658px) and (display-mode: picture-in-picture) {
    .lyrics-container {
      margin: 30px 0;
      width: auto;
      font-size: 18px;
    }
    .lyrics {
      padding-left: 3rem;
      padding-right: 3rem;
    }
    .lyrics .line {
      padding-left: 0;
    }
    .lyrics .countdown-container {
      left: 4rem;
      top: 0;
      transform: translateX(-50%);
    }
  }
  @media screen and (max-width: 658px) {
    .lyrics-container {
      margin: 0px 0px 0px 0px;
      width: auto;
      font-size: 18px;
    }
    .line {
      padding-left: 0;
    }
    .lyrics .countdown-container {
      top: 0.8rem;
      left: 50%;
    }
  }

  @media all and (display-mode: picture-in-picture) {
    .lyrics {
      gap: 0;
      padding-top: 3rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      height: unset;
    }
    .lyrics .line {
      padding-block: 12px;
    }
    .lyrics .line:first-of-type {
      padding-top: 0;
    }
    .lyrics > .line:last-of-type {
      padding-bottom: 0;
    }
    .lyrics-container {
      margin-top: 0px;
      margin-bottom: 0px;
      position: relative;
      height: unset;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
  }
  @media screen and (max-width: 768px) and (display-mode: picture-in-picture) {
    .lyrics .countdown-container {
      left: 4rem;
      top: 0;
    }
  }

  @media screen and (max-width: 658px) and (display-mode: picture-in-picture) {
    .lyrics .countdown-container {
      left: 2rem;
    }
  }

  @media all and (display-mode: fullscreen) {
    .lyrics .countdown-container {
      left: 12rem;
    }
    .lyrics {
      height: calc(100svh - -60px);
      margin-left: 1rem;
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

function Lines({
  document = window.document,
  ready,
}: {
  document?: Document;
  ready: boolean;
}) {
  const { lyricsProgressMs, lyrics, registerContainer } = useLyricsContext();
  const { isPlaying } = useSpotify();
  const containerRef = useRef<HTMLDivElement>(null);
  const pipApp = document.querySelector<HTMLElement>(".pipApp");

  useEffect(() => {
    const unregister = registerContainer(containerRef);
    return unregister;
  }, [registerContainer]);

  useEffect(() => {
    if (containerRef.current && ready) {
      const firstLine = containerRef.current.querySelector(".line.first");
      const currentLine = containerRef.current.querySelector(".line.current");

      const currentElement = firstLine ?? currentLine;
      currentElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [lyrics, ready]);

  if (!lyrics || !lyrics.lines.length) return null;

  return (
    <div className="lyrics" ref={containerRef}>
      {lyrics.lines[0].startTimeMs &&
        typeof lyricsProgressMs === "number" &&
        +lyrics.lines[0].startTimeMs >= 2000 &&
        lyricsProgressMs <= +lyrics.lines[0].startTimeMs && (
          <CountDown
            duration={+lyrics.lines[0].startTimeMs}
            currentProgress={lyricsProgressMs}
            isPlaying={isPlaying}
            size={pipApp ? 24 : 32}
          />
        )}

      {lyrics.lines.map((line, i) => {
        const type = getLineType({
          currentLine: line,
          lyricsProgressMs,
          nextLine: lyrics.lines[i + 1],
          index: i,
        });

        const isEmptyLine =
          i !== 0 && line.words === "" && i !== lyrics.lines.length - 1;
        const startTime = line.startTimeMs;
        const endTime = lyrics.lines[i + 1]?.startTimeMs;

        return (
          <LyricLine line={line} type={type} key={`line-${i}`}>
            {isEmptyLine && startTime && endTime ? (
              <CountDown
                duration={+endTime - +startTime}
                key={`empty-line-${i}-${startTime}`}
                type={CountDownType.DOTS}
                isPlaying={isPlaying}
                currentProgress={lyricsProgressMs}
                startTime={+startTime}
                size={pipApp ? 72 : 98}
              />
            ) : (
              line.words
            )}
          </LyricLine>
        );
      })}
    </div>
  );
}

export default function FullScreenLyrics({
  document = window.document,
  source,
}: {
  document?: Document;
  source?: string;
}): ReactElement {
  const { lyricsBackgroundColor, lyrics, lyricsError, lyricsLoading } =
    useLyricsContext();

  const { isPremium } = useAuth();
  const [ready, setReady] = useState(false);

  useHeader({
    disableOpacityChange: true,
    alwaysDisplayColor: false,
    showOnFixed: false,
    disableBackground: true,
    ignoreAll: !source,
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = document.body;

    const originalRootBgColor = root.style.getPropertyValue(
      "--lyrics-background-color"
    );
    const originalBodyHeaderColor =
      body.style.getPropertyValue("--header-color");
    const originalBodyHeaderOpacity =
      body.style.getPropertyValue("--header-opacity");

    root.style.setProperty("--lyrics-background-color", lyricsBackgroundColor);
    body.style.setProperty("--header-color", lyricsBackgroundColor);
    body.style.setProperty("--header-opacity", "0");

    return () => {
      root.style.setProperty("--lyrics-background-color", originalRootBgColor);
      body.style.setProperty("--header-color", originalBodyHeaderColor);
      body.style.setProperty("--header-opacity", originalBodyHeaderOpacity);
    };
  }, [lyricsBackgroundColor, document.body, document.documentElement]);

  useEffect(() => {
    const shouldModifyBackground = source !== "main-footer";
    const app = shouldModifyBackground
      ? document.querySelector<HTMLElement>(".app")
      : null;
    const originalBackground = app?.style?.backgroundColor;
    const originalPosition = app?.style?.position;

    if (app) {
      app.style.backgroundColor = lyricsBackgroundColor;
      app.style.position = "relative";
    }

    return () => {
      if (app) {
        app.style.backgroundColor = originalBackground ?? "";
        app.style.position = originalPosition ?? "";
      }
    };
  }, [document, lyricsBackgroundColor, source]);

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

    setReady(true);

    return () => {
      pipStyleTag?.remove();
      pipStyleTag2?.remove();
      lineStyles?.remove();
      setReady(false);
    };
  }, [document, lyricsBackgroundColor]);

  return (
    <div className="lyrics-container" style={{ display: "grid" }}>
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
      <Lines document={document} ready={ready} />
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
