import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { ACCESSTOKENCOOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";
import useSpotify from "./useSpotify";

export default function useSpotifyPlayer({
  volume,
  name,
}: {
  volume: number;
  name: string;
}): {
  deviceId: string | undefined;
  player: MutableRefObject<Spotify.Player | undefined>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
} {
  const { deviceId, setDeviceId, setIsPlaying, setCurrentlyPlaying } =
    useSpotify();
  const player = useRef<Spotify.Player>();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      player.current = new window.Spotify.Player({
        getOAuthToken: (callback: CallableFunction) => {
          callback(takeCookie(ACCESSTOKENCOOKIE) ?? "");
        },
        name,
        volume,
      });

      player.current.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
        }
      );

      player.current.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      player.current.addListener("player_state_changed", (trackWindow) => {
        setIsPlaying(!trackWindow?.paused);
        console.log(
          "Currently Playing",
          trackWindow?.track_window.current_track
        );
        setCurrentlyPlaying(trackWindow?.track_window.current_track);
        console.log("Position in Song", trackWindow?.position);
        console.log("Duration of Song", trackWindow?.duration);
      });

      // player.addListener("initialization_error", (error) => console.log(error));
      // player.addListener("authentication_error", (error) => console.log(error));
      // player.addListener("account_error", (error) => console.log(error));
      // player.addListener("playback_error", (error) => console.log(error));

      player.current.connect();
    };

    return () => {
      player.current?.removeListener("not_ready");
      player.current?.removeListener("ready");
      player.current?.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { deviceId, player, setIsPlaying };
}
