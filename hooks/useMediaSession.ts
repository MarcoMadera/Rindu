import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";
import { ITrack } from "types/spotify";
import useAuth from "./useAuth";
import { AudioPlayer } from "./useSpotifyPlayer";

export default function useMediaSession({
  currentlyPlaying,
  currentlyPlayingPosition,
  player,
  isPlaying,
  setIsPlaying,
  videoRef,
}: {
  currentlyPlaying: ITrack | undefined;
  currentlyPlayingPosition: number | undefined;
  player: Spotify.Player | AudioPlayer | undefined;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  videoRef: MutableRefObject<HTMLVideoElement | undefined>;
}): void {
  const { user } = useAuth();
  const isPremium = user?.product === "premium";
  useEffect(() => {
    const duration = currentlyPlaying?.duration_ms;
    if ("setPositionState" in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: duration ?? 0,
        playbackRate: 1,
        position:
          currentlyPlayingPosition &&
          currentlyPlayingPosition <= (duration ?? 0)
            ? currentlyPlayingPosition
            : 0,
      });
    }
  }, [
    currentlyPlayingPosition,
    currentlyPlaying,
    currentlyPlaying?.duration_ms,
  ]);

  useEffect(() => {
    if (player && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", function () {
          if (!isPremium) {
            player?.togglePlay();
            return;
          }
          (player as Spotify.Player)?.resume();
          setIsPlaying(true);
        });
        navigator.mediaSession.setActionHandler("pause", function () {
          player?.pause();
          setIsPlaying(false);
        });
        navigator.mediaSession.setActionHandler("stop", function () {
          player.pause();
          setIsPlaying(false);
        });
        navigator.mediaSession.setActionHandler("seekbackward", function () {
          player.seek(
            !currentlyPlayingPosition || currentlyPlayingPosition <= 10
              ? 0
              : currentlyPlayingPosition - 10
          );
        });
        navigator.mediaSession.setActionHandler("seekforward", function () {
          player.seek(
            !currentlyPlayingPosition ? 10 : currentlyPlayingPosition + 10
          );
        });
        navigator.mediaSession.setActionHandler("seekto", function (e) {
          e.seekTime && player.seek(e.seekTime);
        });
        navigator.mediaSession.setActionHandler("previoustrack", function () {
          player.previousTrack();
        });
        navigator.mediaSession.setActionHandler("nexttrack", function () {
          player.nextTrack();
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentlyPlayingPosition, isPremium, player, user, setIsPlaying]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      if (isPlaying) {
        navigator.mediaSession.playbackState = "playing";
      }
      if (!isPlaying) {
        navigator.mediaSession.playbackState = "paused";
      }
      if (!isPlaying && !currentlyPlaying) {
        navigator.mediaSession.playbackState = "none";
      }
    }
  }, [currentlyPlaying, isPlaying]);

  useEffect(() => {
    if (currentlyPlaying && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentlyPlaying.name,
        artist: currentlyPlaying.artists?.[0]?.name,
        album: currentlyPlaying.album?.name,
        artwork: currentlyPlaying.album?.images?.map(
          ({ url, width, height }) => {
            return {
              src: url ?? "",
              sizes: `${width || 0}x${height || 0}`,
              type: "",
            };
          }
        ),
      });
    }
  }, [currentlyPlaying, videoRef]);
}
