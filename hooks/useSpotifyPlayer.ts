import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

import { useAuth, useSpotify, useToast, useTranslations } from "hooks";
import { ITrack } from "types/spotify";
import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";
import { refreshAccessToken, transferPlayback } from "utils/spotifyCalls";

export interface AudioPlayer extends HTMLAudioElement {
  nextTrack: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  previousTrack: () => void;
  togglePlay: () => void;
  allTracks: ITrack[];
  sliderBusy: boolean;
}

export function useSpotifyPlayer({ name }: { name: string }): {
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
    setPreviousTracks,
    setNextTracks,
    setPlayer,
    allTracks,
    setSuffleState,
    setRepeatState,
    volume,
  } = useSpotify();
  const spotifyPlayer = useRef<Spotify.Player>();
  const audioPlayer = useRef<AudioPlayer>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { translations } = useTranslations();

  useEffect(() => {
    if (!user) return;
    const isPremium = user.product === "premium";

    if (!isPremium) {
      audioPlayer.current = new Audio() as AudioPlayer;

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
            ({ preview_url }) => preview_url === player?.src
          );
          const nextTrackIndex = (currentTrackIndex ?? -1) + 1;
          let nextTrack;
          for (
            let index = nextTrackIndex;
            index < (player?.allTracks ? player?.allTracks.length : 0);
            index++
          ) {
            const audio = player?.allTracks[index]?.preview_url;
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
          player.play();
          setIsPlaying(true);
          setCurrentlyPlaying(nextTrack.track);
        }
      };

      audioPlayer.current.previousTrack = function () {
        const player = audioPlayer.current;
        function getPreviousTrack() {
          const currentTrackIndex = player?.allTracks.findIndex(
            ({ preview_url }) => preview_url === player?.src
          );
          let previousTrackIndex = (currentTrackIndex ?? -1) - 1;
          let previousTrack;

          while (previousTrackIndex >= 0) {
            const audio =
              audioPlayer.current?.allTracks[previousTrackIndex]?.preview_url;
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
          player.play();
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
            Math.round(audioPlayer.current?.currentTime ?? 0)
          );
        }
      };

      audioPlayer.current.ondurationchange = () => {
        setCurrentlyPlayingDuration(
          Math.round(audioPlayer.current?.duration ?? 0)
        );
      };

      setPlayer(audioPlayer.current);
    }

    if (!user.uri || !isPremium) {
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      spotifyPlayer.current = new window.Spotify.Player({
        getOAuthToken: (callback) => {
          refreshAccessToken().then(() => {
            const accessToken = takeCookie(ACCESS_TOKEN_COOKIE);
            callback(accessToken ?? "");
          });
        },
        name,
        volume,
      });

      spotifyPlayer.current.on(
        "ready",
        ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
          transferPlayback([device_id], { play: false });
          addToast({
            variant: "info",
            message: translations.toastMessages.playerReady,
          });
        }
      );

      spotifyPlayer.current.on(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.warn("Device ID has gone offline", device_id);
          addToast({
            variant: "error",
            message: translations.toastMessages.playerNotReady,
          });
        }
      );
      spotifyPlayer.current?.on("player_state_changed", (playbackState) => {
        setCurrentlyPlayingDuration(playbackState?.duration);
        setCurrentlyPlayingPosition(playbackState?.position);
        setCurrentlyPlaying(playbackState?.track_window?.current_track);
        setSuffleState(playbackState?.shuffle);
        setRepeatState(playbackState?.repeat_mode);

        if (playbackState) {
          setIsPlaying(!playbackState.paused);
        }
        setPreviousTracks(playbackState?.track_window?.previous_tracks || []);
        setNextTracks(playbackState?.track_window?.next_tracks || []);
      });

      spotifyPlayer.current?.on("authentication_error", () => {
        addToast({
          variant: "error",
          message: translations.toastMessages.playerAuthenticationError,
        });
      });
      spotifyPlayer.current?.on("autoplay_failed", () => {
        addToast({
          variant: "error",
          message: translations.toastMessages.playerAutoPlayFailed,
        });
      });

      spotifyPlayer.current.addListener("initialization_error", () => {
        addToast({
          variant: "error",
          message: translations.toastMessages.playerInitializationError,
        });
      });
      spotifyPlayer.current.addListener("account_error", () => {
        addToast({
          variant: "error",
          message: translations.toastMessages.playerAccountError,
        });
      });
      spotifyPlayer.current.addListener("playback_error", () => {
        addToast({
          variant: "error",
          message: translations.toastMessages.playerPlaybackError,
        });
      });

      spotifyPlayer.current.connect().then((success) => {
        if (success) {
          setPlayer(spotifyPlayer.current);
          console.info(
            "The Web Playback SDK successfully connected to Spotify!"
          );
        }
      });
    };

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === " ") {
        event.preventDefault();
        spotifyPlayer.current?.togglePlay();
      }
    }

    document.addEventListener("keydown", handleKeyDown, false);

    return () => {
      spotifyPlayer.current?.removeListener("not_ready");
      spotifyPlayer.current?.removeListener("ready");
      spotifyPlayer.current?.disconnect();
      document.removeEventListener("keydown", handleKeyDown, false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uri]);

  return { deviceId, player: spotifyPlayer ?? audioPlayer, setIsPlaying };
}
