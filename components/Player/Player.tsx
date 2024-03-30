import { ReactElement } from "react";

import {
  NextTrack,
  Pause,
  Play,
  PreviousTrack,
  Repeat,
  Suffle,
} from "components/icons";
import { useAuth, useSpotify, useToast, useTranslations } from "hooks";
import { repeat, suffle } from "utils/spotifyCalls";

export default function Player(): ReactElement {
  const {
    isPlaying,
    currentlyPlaying,
    player,
    deviceId,
    suffleState,
    repeatState,
  } = useSpotify();
  const { isPremium } = useAuth();
  const { addToast } = useToast();
  const { translations } = useTranslations();

  return (
    <>
      <div className="player">
        <button
          type="button"
          aria-label="Suffle"
          onClick={(e) => {
            e.stopPropagation();
            if (!isPremium) {
              addToast({
                variant: "error",
                message: translations.toastMessages.premiumRequired,
              });
              return;
            }
            if (!deviceId) {
              addToast({
                variant: "error",
                message: translations.toastMessages.noDeviceConnected,
              });
              return;
            }
            suffle(!suffleState, deviceId);
          }}
          className="button playerButton suffle"
        >
          <Suffle fill={suffleState ? "#1db954" : "#ffffffb3"} />
        </button>
        <button
          type="button"
          aria-label="Previous track"
          onClick={(e) => {
            e.stopPropagation();
            player?.previousTrack();
          }}
          className="button playerButton previous"
        >
          <PreviousTrack fill="#ffffffb3" />
        </button>
        <button
          type="button"
          className="button toggle"
          aria-label="Play/pause"
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!currentlyPlaying) {
              addToast({
                variant: "error",
                message: translations.toastMessages.nothingPlaying,
              });
              return;
            }
            player?.togglePlay();
          }}
        >
          {currentlyPlaying && isPlaying ? <Pause /> : <Play />}
        </button>
        <button
          type="button"
          aria-label="Next track"
          onClick={(e) => {
            e.stopPropagation();
            player?.nextTrack();
          }}
          className="button playerButton next"
        >
          <NextTrack fill="#ffffffb3" />
        </button>
        <button
          type="button"
          aria-label="Repeat"
          onClick={(e) => {
            e.stopPropagation();
            if (!isPremium) {
              addToast({
                variant: "error",
                message: translations.toastMessages.premiumRequired,
              });
              return;
            }

            const singleRepeatState = repeatState === 1 ? "track" : "off";

            const state = repeatState === 0 ? "context" : singleRepeatState;
            if (!deviceId) {
              addToast({
                variant: "error",
                message: translations.toastMessages.noDeviceConnected,
              });
              return;
            }
            (player as Spotify.Player).activateElement().then(() => {
              repeat(state, deviceId);
            });
          }}
          className="button playerButton repeat"
        >
          <Repeat
            fill={repeatState === 0 ? "#ffffffb3" : "#1db954"}
            state={repeatState}
          />
        </button>
      </div>
      <style jsx>{`
        div.player {
          display: flex;
          column-gap: 16px;
          min-width: 280px;
          justify-content: center;
          width: 40%;
        }
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          background-color: transparent;
          position: relative;
        }
        .button {
          width: 32px;
          height: 32px;
        }
        .button.toggle {
          border-radius: 50%;
          background-color: #fff;
        }
        .button.playerButton:hover :global(svg path),
        .button.playerButton:focus :global(svg path) {
          fill: #fff;
        }
        .button.playerButton:active :global(svg path) {
          fill: #ffffffb3;
        }
        .button.toggle:hover,
        .button.toggle:focus,
        .button.toggle:hover :global(svg),
        .button.toggle:focus :global(svg) {
          transform: scale(1.05);
        }
        .button.toggle:active {
          transform: scale(1);
        }
        .repeat::after {
          background-color: #1db954;
          border-radius: 50%;
          bottom: 0;
          content: "";
          display: block;
          height: 4px;
          left: 50%;
          position: absolute;
          -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
          width: 4px;
        }
        .repeat::after {
          display: ${repeatState === 0 ? "none" : "block"};
        }
        .button.suffle.playerButton:hover :global(svg path),
        .button.suffle.playerButton:focus :global(svg path) {
          fill: ${!suffleState ? "#fff" : "#2fd669"};
        }
        .button.repeat.playerButton:hover :global(svg path),
        .button.repeat.playerButton:focus :global(svg path) {
          fill: ${repeatState === 0 ? "#fff" : "#2fd669"};
        }
        @media (max-width: 750px) {
          .repeat,
          .suffle {
            display: none;
          }
        }
        @media (max-width: 1100px) {
          .repeat,
          .suffle {
            display: none;
          }
        }
        @media (max-width: 1000px) {
          div.player {
            justify-content: flex-end;
          }
          div.player {
            justify-content: center;
            min-width: 100%;
          }
        }
        @media (max-width: 600px) {
          .previous,
          .next {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
