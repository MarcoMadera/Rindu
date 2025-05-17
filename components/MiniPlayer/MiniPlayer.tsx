import { ReactElement, useEffect, useState } from "react";

import { useRouter } from "next/router";
import css from "styled-jsx/css";

import { Player, ProgressBar, ScrollableText } from "components";

import { styles as playerSytles } from "components/Player";
import { styles as progressBarStyles } from "components/ProgressBar";
import { styles as scrollableTextStyles } from "components/ScrollableText";
import { styles as sliderStyles } from "components/Slider";

import { useContextMenu, useSpotify } from "hooks";

import { chooseImage, configuration, getMainColorFromImage } from "utils";

interface Props {
  document?: Document;
}

const styles = css.global`
  .player-container {
    justify-self: center;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    width: 100%;
    max-width: 100%;
    padding: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
      sans-serif;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    top: 0;
    z-index: 300;
    min-height: 0;
    height: auto;
    user-select: none;
  }

  .cover-art-container {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.9);
    overflow: hidden;
    position: relative;
  }

  .cover-art-container > div {
    display: inline-flex;
  }

  .bg-1-mini,
  .bg-2-mini {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }

  .bg-1-mini {
    background-color: gray;
    transition: background-color 0.1s ease;
  }

  .bg-2-mini {
    background-image:
      linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),
      url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
  }

  .cover-art {
    width: 100%;
    max-width: 320px;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    background: #000;
  }

  .cover-art img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 320px;
    width: auto;
    max-width: 100%;
    object-fit: cover;
    background: #000;
  }

  .player-info {
    padding: 12px 16px;
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
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
    width: 100%;
  }

  .track-info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .track-info .player {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .track-title {
    color: white;
    font-size: 18px;
    font-weight: 600;
    text-decoration: none;
    width: fit-content;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .track-title:hover {
    text-decoration: underline;
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

  @media (min-width: 768px) {
    .player-info {
      max-width: 720px;
    }
  }
  @media (min-width: 360px) {
    .track-info {
      align-items: center;
    }
  }

  @media (min-width: 1024px) {
    .player-info {
      max-width: 820px;
    }
  }

  @media (min-width: 1440px) {
    .player-info {
      max-width: 960px;
    }
  }

  @media (max-width: 480px) {
    .player-info {
      padding: 10px 12px;
    }
  }
`;

export default function MiniPlayer({
  document = window.document,
}: Props): ReactElement {
  const { addContextMenu } = useContextMenu();
  const { currentlyPlaying } = useSpotify();
  const router = useRouter();
  const [containerColor, setContainerColor] = useState("#323131");

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

  useEffect(() => {
    if (!currentlyPlaying?.id) return;
    getMainColorFromImage(
      `cover-art-pip-mini-player-${currentlyPlaying.id}`,
      (color: string) => {
        setContainerColor(color);
        const backgroundColor = configuration.get("colorizedLyrics")
          ? color
          : "#767676";

        document.documentElement.style.setProperty(
          "--lyrics-background-color",
          backgroundColor
        );

        const pipApp = document.querySelector(".pipApp") as HTMLElement;

        if (pipApp) {
          pipApp.style.backgroundColor = backgroundColor;
        }
      },
      undefined,
      document
    );
  }, [router.asPath, currentlyPlaying?.id, document]);

  const handleTrackClick = () => {
    if (currentlyPlaying?.id) {
      router.push(
        `/${currentlyPlaying.type ?? "track"}/${currentlyPlaying.id}`
      );
    }
  };

  return (
    <>
      {currentlyPlaying?.album?.images.length && (
        <div className="cover-art-container">
          <div>
            <div
              className="bg-1-mini"
              style={{ backgroundColor: containerColor }}
            ></div>
            <div className="bg-2-mini"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              id={`cover-art-pip-mini-player-${currentlyPlaying.id}`}
              src={chooseImage(currentlyPlaying.album?.images, 300).url}
              alt={`${currentlyPlaying.name} cover`}
              className="cover-art"
            />
          </div>
        </div>
      )}

      <div className="player-info">
        <ProgressBar document={document} />
        <div className="track-info">
          {!currentlyPlaying ? null : currentlyPlaying.id ? (
            <ScrollableText key={currentlyPlaying.uri}>
              <span>
                <button
                  className="track-title"
                  onClick={handleTrackClick}
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
                  {currentlyPlaying.name}
                </button>
              </span>
            </ScrollableText>
          ) : (
            <ScrollableText key={currentlyPlaying.uri}>
              <span>{currentlyPlaying.name}</span>
            </ScrollableText>
          )}

          <Player />
        </div>
      </div>
    </>
  );
}
