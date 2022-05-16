import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { AllTracksFromAPlayList } from "types/spotify";
import useAuth from "./useAuth";
import useToast from "./useToast";
import useSpotify from "./useSpotify";
import { getAccessToken } from "utils/spotifyCalls/getAccessToken";

export interface AudioPlayer extends HTMLAudioElement {
  nextTrack: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  previousTrack: () => void;
  togglePlay: () => void;
  allTracks: AllTracksFromAPlayList;
  sliderBusy: boolean;
}

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
    allTracks,
  } = useSpotify();
  const spotifyPlayer = useRef<Spotify.Player>();
  const audioPlayer = useRef<AudioPlayer>();
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) return;
    const isPremium = user?.product === "premium";

    if (!isPremium) {
      audioPlayer.current = new Audio() as AudioPlayer;

      audioPlayer.current.ondurationchange = function () {
        setCurrentlyPlayingDuration(audioPlayer.current?.duration);
      };

      audioPlayer.current.seek = function (seek: number) {
        if (audioPlayer.current) {
          audioPlayer.current.currentTime = seek;
        }
      };

      audioPlayer.current.onplaying = function () {
        setIsPlaying(true);
      };

      audioPlayer.current.allTracks = allTracks;

      audioPlayer.current.setVolume = function (volume: number) {
        if (audioPlayer.current) {
          audioPlayer.current.volume = volume;
        }
      };
      audioPlayer.current.togglePlay = function () {
        if (audioPlayer.current?.paused) {
          audioPlayer.current?.play();
          setIsPlaying(true);
          return;
        }
        audioPlayer.current?.pause();
        setIsPlaying(false);
      };

      audioPlayer.current.nextTrack = function () {
        const player = audioPlayer.current;
        function getNextTrack() {
          const currentTrackIndex = player?.allTracks?.findIndex(
            ({ audio }) => audio === player?.src
          );
          const nextTrackIndex = (currentTrackIndex ?? -1) + 1;
          let nextTrack;
          for (
            let index = nextTrackIndex;
            index < (player?.allTracks ? player?.allTracks.length : 0);
            index++
          ) {
            const audio = player?.allTracks[index]?.audio;
            if (audio) {
              nextTrack = {
                track: player?.allTracks[index],
                audio,
              };
              break;
            }
          }
          return nextTrack;
        }

        const nextTrack = getNextTrack();

        if (nextTrack?.audio && player) {
          player.src = nextTrack.audio;
          player?.play();
          setIsPlaying(true);
          setCurrentlyPlaying(nextTrack.track);
        }
      };

      audioPlayer.current.previousTrack = function () {
        const player = audioPlayer.current;
        function getPreviousTrack() {
          const currentTrackIndex = player?.allTracks.findIndex(
            ({ audio }) => audio === player?.src
          );
          let previousTrackIndex = (currentTrackIndex ?? -1) - 1;
          let previousTrack;

          while (previousTrackIndex >= 0) {
            const audio =
              audioPlayer.current?.allTracks[previousTrackIndex]?.audio;
            if (audio) {
              previousTrack = {
                track: audioPlayer.current?.allTracks[previousTrackIndex],
                audio,
              };
              break;
            }
            previousTrackIndex--;
          }

          return previousTrack;
        }

        const previousTrack = getPreviousTrack();

        if (previousTrack?.audio && player) {
          player.src = previousTrack.audio;
          player?.play();
          setCurrentlyPlaying(previousTrack.track);
        }
      };

      audioPlayer.current.onended = function () {
        const player = audioPlayer.current;
        if (!player) return;
        setIsPlaying(false);
        player.currentTime = 0;
        player.pause();
        audioPlayer.current?.nextTrack();
      };

      audioPlayer.current.ontimeupdate = () => {
        if (!audioPlayer.current?.sliderBusy) {
          setCurrentlyPlayingPosition(
            Math.floor(audioPlayer.current?.currentTime ?? 0)
          );
        }
      };

      audioPlayer.current.ondurationchange = () => {
        setCurrentlyPlayingDuration(audioPlayer.current?.duration);
      };

      setPlayer(audioPlayer.current);
    }

    if (!user?.uri || !isPremium) {
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      spotifyPlayer.current = new window.Spotify.Player({
        getOAuthToken: async (callback: CallableFunction) => {
          const { accessToken } = (await getAccessToken()) || {};
          if (accessToken) {
            callback(accessToken);
          }
        },
        name,
        volume,
      });

      spotifyPlayer.current.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
          addToast({
            variant: "info",
            message: "You are now connected to Spotify, enjoy!",
          });
        }
      );

      spotifyPlayer.current.on(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
          addToast({
            variant: "error",
            message: "Connection failed, please try again later",
          });
        }
      );

      spotifyPlayer.current?.on("player_state_changed", (trackWindow) => {
        setCurrentlyPlayingDuration(trackWindow?.duration);
        setCurrentlyPlayingPosition(trackWindow?.position);
        setCurrentlyPlaying(trackWindow?.track_window.current_track);

        if (trackWindow) {
          setIsPlaying(!trackWindow.paused);
        }
        // trackWindow?.track_window.next_tracks
        // trackWindow?.track_window.previous_tracks
      });

      spotifyPlayer.current?.on("authentication_error", () => {
        addToast({
          variant: "error",
          message: "The user has not been authenticated",
        });
      });
      spotifyPlayer.current?.on("autoplay_failed", () => {
        addToast({
          variant: "error",
          message: "The track failed to play",
        });
      });

      spotifyPlayer.current.addListener("initialization_error", () => {
        addToast({
          variant: "error",
          message: "Error initializing Spotify Player",
        });
      });
      spotifyPlayer.current.addListener("authentication_error", () => {
        addToast({
          variant: "error",
          message: "Authentication Error",
        });
      });
      spotifyPlayer.current.addListener("account_error", () => {
        addToast({
          variant: "error",
          message: "Error getting account info",
        });
      });
      spotifyPlayer.current.addListener("playback_error", () => {
        addToast({
          variant: "error",
          message: "Error playing this track",
        });
      });

      spotifyPlayer.current.connect();
      setPlayer(spotifyPlayer.current);
    };

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === " ") {
          event.preventDefault();
          spotifyPlayer.current?.togglePlay();
        }
      },
      false
    );

    return () => {
      spotifyPlayer.current?.removeListener("not_ready");
      spotifyPlayer.current?.removeListener("ready");
      spotifyPlayer.current?.disconnect();
      document.removeEventListener(
        "keydown",
        (event) => {
          if (event.key === " ") {
            event.preventDefault();
            spotifyPlayer.current?.togglePlay();
          }
        },
        false
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uri]);

  return { deviceId, player: spotifyPlayer ?? audioPlayer, setIsPlaying };
}
