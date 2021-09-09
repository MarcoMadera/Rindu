/* eslint-disable @typescript-eslint/ban-ts-comment */
import useSpotifyPlayer from "hooks/useSpotifyPlayer";
import Script from "next/script";
import { ReactElement, useState } from "react";

export default function SpotifyPlayer(): ReactElement {
  const [volume, setVolume] = useState(1);
  const { deviceId } = useSpotifyPlayer(volume);

  console.log("device Id", deviceId);

  return (
    <div>
      <Script src="https://sdk.scdn.co/spotify-player.js" defer></Script>
      <style jsx>{`
        div {
          height: 90px;
          width: 100%;
          background: rgb(29, 28, 28);
        }
      `}</style>
    </div>
  );
}
