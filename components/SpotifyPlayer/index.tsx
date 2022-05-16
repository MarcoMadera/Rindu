import {
  NextTrack,
  Pause,
  Play,
  PreviousTrack,
  Repeat,
  Suffle,
} from "components/icons";
import { Volume } from "components/icons/Volume";
import Slider from "components/Slider";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import useSpotifyPlayer from "hooks/useSpotifyPlayer";
import Script from "next/script";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { NavbarLeft } from "./NavbarLeft";
import useToast from "hooks/useToast";
import { suffle } from "utils/spotifyCalls/suffle";
import { repeat } from "utils/spotifyCalls/repeat";
import DeviceConnect from "components/icons/DeviceConnect";
import { getAvailableDevices } from "utils/spotifyCalls/getAvailableDevices";
import { transferPlayback } from "utils/spotifyCalls/transferPlayback";

export default function SpotifyPlayer(): ReactElement {
  const {
    isPlaying,
    currrentlyPlaying,
    player,
    volume,
    setVolume,
    lastVolume,
    setLastVolume,
    deviceId,
  } = useSpotify();
  useSpotifyPlayer({ volume, name: "Rindu" });
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const { user, accessToken } = useAuth();
  const { addToast } = useToast();
  const isPremium = user?.product === "premium";
  const [suffleState, setSuffleState] = useState(false);
  const [repeatState, setRepeatState] = useState<"track" | "off" | "context">(
    "off"
  );
  const [repeatTrackUri, setRepeatTrackUri] = useState<string | undefined>();
  const [devices, setDevices] = useState<SpotifyApi.UserDevice[]>([]);

  useEffect(() => {
    if (!user?.product) {
      return;
    }

    if (user?.product === "premium") {
      addToast({
        variant: "info",
        message: "Welcome to Rindu, preparing your music for you",
      });
    } else {
      addToast({
        variant: "info",
        message: "Welcome to Rindu, prepare to enjoy!",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.product]);

  useEffect(() => {
    const isSameRepeating = repeatTrackUri
      ? repeatTrackUri === currrentlyPlaying?.uri
      : false;
    if (repeatState === "track" && !isSameRepeating) {
      setRepeatState("off");
      setRepeatTrackUri("");
    }
  }, [currrentlyPlaying?.uri, repeatState, repeatTrackUri]);

  const getActualVolume = useCallback(() => {
    if (volume > 0) {
      return 0;
    }
    if (lastVolume === 0 && volume === 0) {
      return 1;
    }
    return lastVolume;
  }, [lastVolume, volume]);

  return (
    <footer>
      <div className="container">
        {isPremium ? (
          <Script src="https://sdk.scdn.co/spotify-player.js"></Script>
        ) : null}
        <section>
          {currrentlyPlaying && (
            <NavbarLeft currrentlyPlaying={currrentlyPlaying} />
          )}
        </section>
        <section>
          <div className="player">
            <button
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
              onClick={() => {
                player?.previousTrack();
              }}
              className="button playerButton"
            >
              <PreviousTrack fill="#b3b3b3" />
            </button>
            <button
              className="button toggle"
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
              onClick={() => {
                player?.nextTrack();
              }}
              className="button playerButton"
            >
              <NextTrack fill="#b3b3b3" />
            </button>
            <button
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
        </section>
        <section>
          <div className="extras">
            <div className="devices">
              {devices.length > 0 && (
                <div className="devices-container">
                  <header>
                    <h3>Connect to a device</h3>
                    <div className="device-img-header-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://open.scdn.co/cdn/images/connect_header@1x.8f827808.png"
                        alt="connect"
                      />
                    </div>
                  </header>
                  <ul>
                    {devices.map((device) => (
                      <button
                        onClick={() => {
                          if (device.id) {
                            transferPlayback([device.id], accessToken);
                          }
                        }}
                        key={device.id}
                        className={`device ${device.is_active ? "active" : ""}`}
                      >
                        {device.name}
                      </button>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => {
                  if (!isPremium) {
                    addToast({
                      variant: "error",
                      message: "You need to be premium to use this feature",
                    });
                    return;
                  }

                  if (devices.length === 0) {
                    getAvailableDevices(accessToken).then((res) => {
                      if (res?.devices) {
                        setDevices(res.devices);
                      }
                    });
                    return;
                  }
                  setDevices([]);
                }}
                className="button playerButton"
              >
                <DeviceConnect
                  fill={devices.length > 0 ? "#1db954" : "#b3b3b3"}
                />
              </button>
            </div>
            <button
              className="button volume"
              onMouseEnter={() => {
                setIsHoveringVolume(true);
              }}
              onMouseLeave={() => {
                setIsHoveringVolume(false);
              }}
              aria-label={`${volume > 0 ? "Mute" : "Unmute"}`}
              onClick={() => {
                setVolume(getActualVolume());
                if (volume > 0) {
                  setLastVolume(volume);
                }
                player?.setVolume(getActualVolume());
              }}
            >
              <Volume volume={volume} />
            </button>
            <Slider
              value={100}
              updateProgress={volume * 100}
              onProgressChange={(currentPositionPercent) => {
                setVolume(currentPositionPercent / 100);
              }}
              action={() => {
                player?.setVolume(volume);
                setLastVolume(volume);
                localStorage.setItem(
                  "playback",
                  encodeURI(JSON.stringify({ volume }))
                );
              }}
              valueText={`${volume}`}
              initialValuePercent={100}
              maxValue={1}
              showDot={isHoveringVolume}
            />
          </div>
        </section>
      </div>
      <style jsx>{`
        .devices {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 932;
          max-height: calc(100vh - 114px);
          overflow-y: auto;
          padding: 5px;
        }
        .devices-container::before {
          border: 10px solid transparent;
          border-top-color: #282828;
          bottom: -20px;
          content: "";
          position: absolute;
          right: 141px;
        }
        .devices-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          bottom: 70px;
          display: block;
          border-radius: 5px;
          background-color: #282828;
          box-shadow: 0px 2px 9px 0px rgb(0 0 0 / 5%);
          padding: 3px;
          width: 300px;
        }
        .devices-container header {
          display: grid;
          justify-content: center;
        }
        .devices-container h3 {
          display: block;
          padding: 14px 35px 10px 14px;
          font-size: 1.4rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 700;
          color: #fff;
        }
        .device-img-header-container {
          padding: 16px 0;
          text-align: center;
          display: flex;
          justify-content: center;
        }
        .devices-container img {
          width: 180px;
        }
        .device.active {
          color: #1db954;
        }
        button.device {
          background-color: transparent;
          width: max-content;
          min-width: 100%;
          border: none;
          display: flex;
          align-content: center;
          font-weight: 700;
          font-size: 14px;
          line-height: 16px;
          color: #fff;
          text-align: start;
          text-decoration: none;
          border-radius: 3px;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          height: 40px;
        }
        button.device:hover {
          outline: none;
          background-color: #ffffff1a;
        }
        .extras {
          display: flex;
          width: 100%;
          column-gap: 5px;
          align-items: center;
          justify-content: flex-end;
        }
        .volume:hover :global(svg path) {
          fill: #fff;
        }
        .extras :global(.barContainer) {
          max-width: 120px;
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
        section:nth-child(1) {
          min-width: 180px;
          width: 30%;
          display: flex;
          justify-content: flex-start;
        }
        section:nth-child(2) {
          display: flex;
          width: 100%;
          max-width: 550px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        section:nth-child(2) div.player {
          display: flex;
          column-gap: 16px;
          min-width: 280px;
          justify-content: center;
          width: 40%;
        }
        section:nth-child(3) {
          display: flex;
          justify-content: flex-end;
          min-width: 180px;
          width: 30%;
        }
        div.container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: 90px;
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
        footer {
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: #181818;
          border-top: 1px solid #282828;
        }
        @media (max-width: 685px) {
          div.container {
            flex-direction: column;
            gap: 16px;
            height: 270px;
            padding: 16px 0;
          }
          section {
            padding: 0 16px 10px 16px;
          }
          section:nth-child(1) {
            border-bottom: 1px solid #282828;
            width: 100%;
            align-self: baseline;
          }
        }
      `}</style>
    </footer>
  );
}
