import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { AllTracksFromAPlayList } from "types/spotify";
import useAuth from "./useAuth";
import useSpotify from "./useSpotify";

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
  const { accessToken, user } = useAuth();

  useEffect(() => {
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

          if ("mediaSession" in navigator && nextTrack.track) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: nextTrack.track.name,
              artist: nextTrack.track.artists?.[0]?.name,
              album: nextTrack.track.album.name,
              artwork: nextTrack.track.album.images?.map(
                ({ url, width, height }) => {
                  return {
                    src: url,
                    sizes: `${width}x${height}`,
                    type: "",
                  };
                }
              ),
            });
          }
        }
      };

      audioPlayer.current.previousTrack = function () {
        const player = audioPlayer.current;
        function getpreViousrack() {
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

          if ("mediaSession" in navigator && previousTrack) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: previousTrack.track?.name,
              artist: previousTrack.track?.artists?.[0]?.name,
              album: previousTrack.track?.album.name,
              artwork: previousTrack.track?.album.images?.map(
                ({ url, width, height }) => {
                  return {
                    src: url,
                    sizes: `${width}x${height}`,
                    type: "",
                  };
                }
              ),
            });
          }

          return previousTrack;
        }

        const previousTrack = getpreViousrack();

        if (previousTrack?.audio && player) {
          player.src = previousTrack.audio;
          player?.play();
          setCurrentlyPlaying(previousTrack.track);

          if ("mediaSession" in navigator && previousTrack.track) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: previousTrack.track.name,
              artist: previousTrack.track.artists?.[0]?.name,
              album: previousTrack.track.album.name,
              artwork: previousTrack.track.album.images?.map(
                ({ url, width, height }) => {
                  return {
                    src: url,
                    sizes: `${width}x${height}`,
                    type: "",
                  };
                }
              ),
            });
          }
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

      audioPlayer.current.ondurationchange = () =>
        setCurrentlyPlayingDuration(audioPlayer.current?.duration);
      setPlayer(audioPlayer.current);
    }

    if (!accessToken || !isPremium) {
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      spotifyPlayer.current = new window.Spotify.Player({
        getOAuthToken: (callback: CallableFunction) => {
          callback(accessToken);
        },
        name,
        volume,
      });

      setPlayer(spotifyPlayer.current);

      spotifyPlayer.current.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
        }
      );

      spotifyPlayer.current.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      spotifyPlayer.current.addListener(
        "player_state_changed",
        (trackWindow) => {
          setCurrentlyPlaying(trackWindow?.track_window.current_track);
          setCurrentlyPlayingPosition(trackWindow?.position);
          setCurrentlyPlayingDuration(trackWindow?.duration);

          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: trackWindow?.track_window.current_track.name,
              artist: trackWindow?.track_window.current_track.artists[0]?.name,
              album: trackWindow?.track_window.current_track.album.name,
              artwork:
                trackWindow?.track_window.current_track.album.images?.map(
                  ({ url, width, height }) => {
                    return {
                      src: url,
                      sizes: `${width}x${height}`,
                      type: "",
                    };
                  }
                ),
            });
          }

          spotifyPlayer.current?.on("authentication_error", () => {
            console.error("The user has not been authenticated");
          });

          setIsPlaying(!trackWindow?.paused);
          // trackWindow?.track_window.next_tracks
          // trackWindow?.track_window.previous_tracks
        }
      );

      spotifyPlayer.current.addListener("initialization_error", (error) =>
        console.log(error)
      );
      spotifyPlayer.current.addListener("authentication_error", (error) =>
        console.log(error)
      );
      spotifyPlayer.current.addListener("account_error", (error) =>
        console.log(error)
      );
      spotifyPlayer.current.addListener("playback_error", (error) =>
        console.log(error)
      );

      spotifyPlayer.current.connect();
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
      if (!accessToken) {
        spotifyPlayer.current?.removeListener("not_ready");
        spotifyPlayer.current?.removeListener("ready");
        spotifyPlayer.current?.disconnect();
      }
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
  }, [accessToken]);

  return { deviceId, player: spotifyPlayer ?? audioPlayer, setIsPlaying };
}
