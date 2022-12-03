import useSpotify from "hooks/useSpotify";
import { ReactElement, useCallback, useState } from "react";
import { Volume } from "./icons/Volume";
import Slider from "./Slider";

export default function VolumeControl(): ReactElement {
  const { player, volume, setVolume, lastVolume, setLastVolume } = useSpotify();
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);

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
    <>
      <button
        type="button"
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
        updateProgress={volume * 100}
        onProgressChange={(currentPositionPercent) => {
          setVolume(currentPositionPercent / 100);
        }}
        action={() => {
          if (!player) return;
          player.setVolume(volume);
          setLastVolume(volume);
          localStorage.setItem(
            "playback",
            encodeURI(JSON.stringify({ volume }))
          );
        }}
        valueText={`${volume}`}
        title={"Control the volume"}
        initialValuePercent={100}
        showDot={isHoveringVolume}
        className="volume-slider"
      />
      <style jsx>{`
        .volume:hover :global(svg path) {
          fill: #fff;
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
        :global(.volume-slider) {
          max-width: 120px;
        }
      `}</style>
    </>
  );
}
