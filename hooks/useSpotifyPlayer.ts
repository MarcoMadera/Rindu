import { useEffect, useState } from "react";
import { ACCESSTOKENCOOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

/* eslint-disable @typescript-eslint/ban-ts-comment */
export default function useSpotifyPlayer(volume: number): {
  deviceId?: string;
} {
  const [deviceId, setDeviceId] = useState<string>();

  useEffect(() => {
    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = () => {
      // @ts-ignore
      const player = new window.Spotify.Player({
        getOAuthToken: (callback: CallableFunction) => {
          callback(takeCookie(ACCESSTOKENCOOKIE) ?? "");
        },
        name: "Rindu",
        volume,
      });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      // player.addListener("player_state_changed", (e) => console.log(e));
      // player.addListener("initialization_error", (error) => console.log(error));
      // player.addListener("authentication_error", (error) => console.log(error));
      // player.addListener("account_error", (error) => console.log(error));
      // player.addListener("playback_error", (error) => console.log(error));

      player.connect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { deviceId };
}
