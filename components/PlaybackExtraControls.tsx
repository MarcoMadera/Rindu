import useSpotify from "hooks/useSpotify";
import { ReactElement } from "react";
import DeviceConnectControl from "./DeviceConnectControl";
import LyricsControl from "./LyricsControl";
import VolumeControl from "./VolumeControl";

export default function PlaybackExtraControls(): ReactElement {
  const { currentlyPlaying } = useSpotify();
  return (
    <div className="extras">
      {currentlyPlaying?.type === "track" && <LyricsControl />}
      <DeviceConnectControl />
      <VolumeControl />
      <style jsx>{`
        .extras {
          display: flex;
          width: 100%;
          column-gap: 5px;
          align-items: center;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
