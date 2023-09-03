import { ReactElement, useEffect, useRef } from "react";

import { useAuth, useLyricsContext, useSpotify } from "hooks";
import { IFormatLyricsResponse } from "utils";

interface ILyricLineProps {
  line: IFormatLyricsResponse["lines"][0];
  type: "current" | "previous" | "next";
}

export function LyricLine({ line, type }: ILyricLineProps): ReactElement {
  const { player } = useSpotify();
  const { user } = useAuth();
  const isPremium = user?.product === "premium";
  const lineRef = useRef<HTMLButtonElement>(null);
  const { lyricsProgressMs, lyricTextColor, lyricLineColor, lyrics } =
    useLyricsContext();

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
          lyrics?.syncType === "LINE_SYNCED"
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
