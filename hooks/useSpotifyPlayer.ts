import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import useAuth from "./useAuth";
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
  const {
    deviceId,
    setDeviceId,
    setIsPlaying,
    setCurrentlyPlaying,
    setCurrentlyPlayingPosition,
    setCurrentlyPlayingDuration,
    setPlayer,
  } = useSpotify();
  const player = useRef<Spotify.Player>();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => {
      player.current = new window.Spotify.Player({
        getOAuthToken: (callback: CallableFunction) => {
          callback(accessToken);
        },
        name,
        volume,
      });

      setPlayer(player.current);

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
        setCurrentlyPlaying(trackWindow?.track_window.current_track);
        setCurrentlyPlayingPosition(trackWindow?.position);
        setCurrentlyPlayingDuration(trackWindow?.duration);
        // trackWindow?.track_window.next_tracks
        // trackWindow?.track_window.previous_tracks
      });

      player.current.addListener("initialization_error", (error) =>
        console.log(error)
      );
      player.current.addListener("authentication_error", (error) =>
        console.log(error)
      );
      player.current.addListener("account_error", (error) =>
        console.log(error)
      );
      player.current.addListener("playback_error", (error) =>
        console.log(error)
      );

      player.current.connect();
    };

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === " ") {
          player.current?.togglePlay();
        }
      },
      false
    );

    return () => {
      player.current?.removeListener("not_ready");
      player.current?.removeListener("ready");
      player.current?.disconnect();
      document.removeEventListener(
        "keydown",
        (event) => {
          if (event.key === " ") {
            player.current?.togglePlay();
          }
        },
        false
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return { deviceId, player, setIsPlaying };
}
