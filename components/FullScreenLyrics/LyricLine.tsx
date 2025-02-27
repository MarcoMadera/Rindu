import { ReactElement, useEffect, useRef, useState } from "react";

import css from "styled-jsx/css";

import { useAuth, useLyricsContext, useSpotify } from "hooks";
import { IFormatLyricsResponse, LineType } from "types/lyrics";

interface ILyricLineProps {
  line: IFormatLyricsResponse["lines"][0];
  type: LineType;
  document?: Document;
}

export const lineCss = css.global`
  .line {
    display: block;
    background-color: transparent;
    border: none;
    width: 100%;
    text-align: left;
    padding-left: 144px;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 54px;
    cursor: pointer;
    transition: all 0.1s ease-out 0s;
  }
  .line:hover {
    color: var(--line-hover-color) !important;
    opacity: 1;
  }
  @media (max-width: 768px) {
    .line {
      padding-left: 0;
      font-size: 18px;
      line-height: 32px;
    }
  }
  @media (max-width: 658px) {
    .line {
      padding-left: 0;
    }
  }
`;

export function LyricLine({
  line,
  type,
  document = window.document,
}: ILyricLineProps): ReactElement {
  const { player, isPlaying } = useSpotify();
  const { isPremium } = useAuth();
  const lineRef = useRef<HTMLButtonElement>(null);
  const {
    lyricsProgressMs,
    lyricTextColor,
    lyricLineColor,
    lyrics,
    syncLyricsLine,
  } = useLyricsContext();

  const lineColors = {
    first: lyricLineColor + "80",
    current: "#ffffff",
    previous: lyricLineColor + "80",
    next: lyricTextColor,
  };

  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const currentLine = line.classList.contains("current");
    if (!currentLine) return;

    const lineHeight = line.offsetHeight;
    let scrollTimeout: NodeJS.Timeout;
    const handleUserScroll = () => {
      setIsManuallyScrolling(true);
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsManuallyScrolling(false);
      }, 150);
    };

    document?.addEventListener("wheel", handleUserScroll);
    document?.addEventListener("touchmove", handleUserScroll);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isManuallyScrolling && isPlaying) {
          line.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      },
      {
        root: null,
        rootMargin: `-${lineHeight}px 0px 0px 0px`,
        threshold: 1.0,
      }
    );

    observer.observe(line);

    return () => {
      observer.disconnect();
      document.removeEventListener("wheel", handleUserScroll);
      document.removeEventListener("touchmove", handleUserScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lyricsProgressMs, isManuallyScrolling, document, isPlaying]);

  const lineColorsType: Record<LineType, string> = {
    first: lineColors.first,
    current: lineColors.current,
    previous: lineColors.previous,
    next: lineColors.next,
  };

  const getColorLine = (type: LineType) =>
    lineColorsType[type] || lyricTextColor;

  useEffect(() => {
    document.body.style.setProperty(
      "--line-hover-color",
      `${lyrics?.colors ? lyricLineColor : "#fff"}`
    );
  }, [lyricLineColor, lyrics?.colors, document]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (
          isPremium &&
          line?.startTimeMs &&
          player &&
          lyrics?.syncType === "LINE_SYNCED"
        ) {
          player.seek(Number(line.startTimeMs));
          syncLyricsLine();
        }
      }}
      className={`line ${type}`}
      dir="auto"
      ref={lineRef}
      style={{ color: getColorLine(type) }}
    >
      {line.words}
      <style jsx>{lineCss}</style>
    </button>
  );
}
