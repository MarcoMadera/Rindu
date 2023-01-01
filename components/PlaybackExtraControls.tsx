import useSpotify from "hooks/useSpotify";
import { ReactElement } from "react";
import { DisplayInFullScreen } from "types/spotify";
import DeviceConnectControl from "./DeviceConnectControl";
import FullScreenControl from "./FullScreenControl";
import FullScreen from "./icons/FullScreen";
import Lyrics from "./icons/Lyrics";
import Queue from "./icons/Queue";
import VolumeControl from "./VolumeControl";

export default function PlaybackExtraControls(): ReactElement {
  const { currentlyPlaying } = useSpotify();
  return (
    <div className="extras">
      {currentlyPlaying?.type === "track" && (
        <FullScreenControl
          icon={Lyrics}
          displayInFullScreen={DisplayInFullScreen.Lyrics}
        />
      )}
      <FullScreenControl
        icon={Queue}
        displayInFullScreen={DisplayInFullScreen.Queue}
      />
      <DeviceConnectControl />
      <VolumeControl />
      <FullScreenControl
        icon={FullScreen}
        displayInFullScreen={DisplayInFullScreen.Player}
      />
      <style jsx>{`
        .extras {
          display: flex;
          width: 100%;
          column-gap: 0px;
          align-items: center;
          justify-content: flex-end;
        }
        @media (max-width: 1100px) {
          .extras {
            column-gap: 5px;
          }
        }
      `}</style>
    </div>
  );
}
