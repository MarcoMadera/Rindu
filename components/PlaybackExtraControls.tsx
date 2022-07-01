import { ReactElement } from "react";
import DeviceConnectControl from "./DeviceConnectControl";
import VolumeControl from "./VolumeControl";

export default function PlaybackExtraControls(): ReactElement {
  return (
    <div className="extras">
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
