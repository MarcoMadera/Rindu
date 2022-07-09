import useSpotify from "hooks/useSpotify";
import { ReactElement } from "react";
import Lyrics from "./icons/Lyrics";

export default function LyricsControl(): ReactElement {
  const { showLyrics, setShowLyrics } = useSpotify();

  return (
    <>
      <button
        type="button"
        className="button lyrics"
        aria-label={`${showLyrics ? "Hide" : "Show"} lyrics`}
        onClick={() => {
          setShowLyrics.toggle();
        }}
      >
        <Lyrics fill={showLyrics ? "#1db954" : "#b3b3b3"} />
      </button>

      <style jsx>{`
        .lyrics:hover :global(svg path) {
          fill: #fff;
        }
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          background-color: transparent;
          position: relative;
          width: 32px;
          height: 32px;
        }
      `}</style>
    </>
  );
}
