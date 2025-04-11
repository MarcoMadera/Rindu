import { ReactElement, useEffect } from "react";

import Link from "next/link";
import css from "styled-jsx/css";

import { Player, ProgressBar, ScrollableText } from "components";

import { styles as playerSytles } from "components/Player";
import { styles as progressBarStyles } from "components/ProgressBar";
import { styles as scrollableTextStyles } from "components/ScrollableText";
import { styles as sliderStyles } from "components/Slider";

import { useContextMenu, useSpotify } from "hooks";
import { chooseImage } from "utils";

interface Props {
  document?: Document;
}

const styles = css.global`
  .player-container {
    justify-self: center;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 12px;
    width: 320px;
    padding: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
      sans-serif;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .cover-art {
    width: 100%;
    height: 320px;
    overflow: hidden;
  }

  .cover-art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .player-info {
    padding: 12px 16px;
  }

  .time-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
    color: #aaa;
  }

  .quality-badge {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    color: #ddd;
  }

  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .track-info .player {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .track-title {
    color: white;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
    text-decoration: none;
  }

  .track-artist {
    color: #aaa;
    font-size: 14px;
    margin: 0;
  }

  .dots-navigation {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin: 12px 0;
  }
`;

export default function MiniPlayer({
  document = window.document,
}: Props): ReactElement {
  const { addContextMenu } = useContextMenu();
  const { currentlyPlaying } = useSpotify();

  useEffect(() => {
    const pipApp = document.querySelector<HTMLElement>(".pipApp");

    const pipStyleTag = document.createElement("style");
    const pipStyleProgressBar = document.createElement("style");
    const pipStyleSlider = document.createElement("style");
    const pipStylesScrollableText = document.createElement("style");
    const pipStylesPlayer = document.createElement("style");

    if (pipApp) {
      pipStyleTag.textContent = styles as unknown as string;
      pipStyleProgressBar.textContent = progressBarStyles as unknown as string;
      pipStyleSlider.textContent = sliderStyles as unknown as string;
      pipStylesScrollableText.textContent =
        scrollableTextStyles as unknown as string;
      pipStylesPlayer.textContent = playerSytles as unknown as string;
      document.head.appendChild(pipStyleTag);
      document.head.appendChild(pipStyleProgressBar);
      document.head.appendChild(pipStyleSlider);
      document.head.appendChild(pipStylesScrollableText);
      document.head.appendChild(pipStylesPlayer);
    }

    return () => {
      pipStyleTag?.remove();
      pipStyleProgressBar?.remove();
      pipStyleSlider?.remove();
      pipStylesScrollableText?.remove();
      pipStylesPlayer?.remove();
    };
  }, [document]);

  return (
    <div className="player-container">
      {currentlyPlaying?.album?.images.length && (
        <div className="cover-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={chooseImage(currentlyPlaying.album?.images, 300).url}
            alt={`${currentlyPlaying.name} cover`}
          />
        </div>
      )}

      <div className="player-info">
        <ProgressBar document={document} />
        <div className="track-info">
          {!currentlyPlaying ? null : currentlyPlaying.id ? (
            <Link
              href={`/${currentlyPlaying.type ?? "track"}/${currentlyPlaying.id}`}
              className="track-title"
              onContextMenu={(e) => {
                e.preventDefault();
                const x = e.pageX;
                const y = e.pageY;
                addContextMenu({
                  type: "cardTrack",
                  data: currentlyPlaying,
                  position: { x, y },
                });
              }}
            >
              <ScrollableText key={currentlyPlaying.uri}>
                {currentlyPlaying.name}
              </ScrollableText>
            </Link>
          ) : (
            <ScrollableText key={currentlyPlaying.uri}>
              {currentlyPlaying.name}
            </ScrollableText>
          )}

          <Player />
        </div>
      </div>
    </div>
  );
}
