import { ReactElement, useCallback, useState } from "react";

import { Slider } from "components";
import { Volume } from "components/icons";
import { useSpotify } from "hooks";

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
        onClick={(e) => {
          e.stopPropagation();
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
        action={(progressPercent) => {
          if (!player) return;
          const currentVolume = progressPercent / 100;
          player.setVolume(currentVolume);
          setLastVolume(currentVolume);
          setVolume(currentVolume);
          localStorage.setItem(
            "playback",
            encodeURI(JSON.stringify({ volume: currentVolume }))
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
          max-width: 100px;
        }
      `}</style>
    </>
  );
}
