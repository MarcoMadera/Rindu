import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import useSpotifyPlayer from "hooks/useSpotifyPlayer";
import useToast from "hooks/useToast";
import { ReactElement, useEffect, useState } from "react";
import { repeat } from "utils/spotifyCalls/repeat";
import { suffle } from "utils/spotifyCalls/suffle";
import { Suffle, PreviousTrack, Pause, Play, NextTrack, Repeat } from "./icons";
import { ProgressBar } from "./ProgressBar";

export default function PlayerControls(): ReactElement {
  const { isPlaying, currrentlyPlaying, player, volume, deviceId } =
    useSpotify();
  useSpotifyPlayer({ volume, name: "Rindu" });
  const { user, accessToken } = useAuth();
  const { addToast } = useToast();
  const isPremium = user?.product === "premium";
  const [suffleState, setSuffleState] = useState(false);
  const [repeatState, setRepeatState] = useState<"track" | "off" | "context">(
    "off"
  );
  const [repeatTrackUri, setRepeatTrackUri] = useState<string | undefined>();

  useEffect(() => {
    const isSameRepeating = repeatTrackUri
      ? repeatTrackUri === currrentlyPlaying?.uri
      : false;
    if (repeatState === "track" && !isSameRepeating) {
      setRepeatState("off");
      setRepeatTrackUri("");
    }
  }, [currrentlyPlaying?.uri, repeatState, repeatTrackUri]);

  return (
    <>
      <div className="player">
        <button
          type="button"
          aria-label="Suffle"
          onClick={() => {
            if (!isPremium) {
              addToast({
                variant: "error",
                message: "You need to be premium to use this feature",
              });
              return;
            }
            if (!deviceId) {
              addToast({
                variant: "error",
                message: "No device connected",
              });
              return;
            }
            suffle(!suffleState, deviceId, accessToken).then((res) => {
              if (res) {
                setSuffleState((prev) => !prev);
              }
            });
          }}
          className="button playerButton suffle"
        >
          <Suffle fill={suffleState ? "#1db954" : "#b3b3b3"} />
        </button>
        <button
          type="button"
          aria-label="Previous track"
          onClick={() => {
            player?.previousTrack();
          }}
          className="button playerButton"
        >
          <PreviousTrack fill="#b3b3b3" />
        </button>
        <button
          type="button"
          className="button toggle"
          aria-label="Play/pause"
          onClick={() => {
            if (!currrentlyPlaying) {
              addToast({
                variant: "error",
                message: "No song playing",
              });
              return;
            }
            player?.togglePlay();
          }}
        >
          {currrentlyPlaying && isPlaying ? <Pause /> : <Play />}
        </button>
        <button
          type="button"
          aria-label="Next track"
          onClick={() => {
            player?.nextTrack();
          }}
          className="button playerButton"
        >
          <NextTrack fill="#b3b3b3" />
        </button>
        <button
          type="button"
          aria-label="Repeat"
          onClick={() => {
            if (!isPremium) {
              addToast({
                variant: "error",
                message: "You need to be premium to use this feature",
              });
              return;
            }

            const state =
              repeatState === "off"
                ? "context"
                : repeatState === "context"
                ? "track"
                : "off";
            if (!deviceId) {
              addToast({
                variant: "error",
                message: "No device connected",
              });
              return;
            }
            if (state === "track") {
              setRepeatTrackUri(currrentlyPlaying?.uri);
            }
            repeat(state, deviceId, accessToken).then((res) => {
              if (res) {
                setRepeatState(state);
              }
            });
          }}
          className="button playerButton repeat"
        >
          <Repeat
            fill={repeatState === "off" ? "#b3b3b3" : "#1db954"}
            state={repeatState}
          />
        </button>
      </div>
      <ProgressBar />
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
          fill: #b3b3b3;
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
          display: ${repeatState === "off" ? "none" : "block"};
        }
        .button.suffle.playerButton:hover :global(svg path),
        .button.suffle.playerButton:focus :global(svg path) {
          fill: ${!suffleState ? "#fff" : "#2fd669"};
        }
        .button.repeat.playerButton:hover :global(svg path),
        .button.repeat.playerButton:focus :global(svg path) {
          fill: ${repeatState === "off" ? "#fff" : "#2fd669"};
        }
      `}</style>
    </>
  );
}
