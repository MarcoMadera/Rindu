import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";

import { useAuth } from "hooks";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { ITrack } from "types/spotify";
import { callPictureInPicture } from "utils";

export function useMediaSession({
  currentlyPlaying,
  currentlyPlayingPosition,
  player,
  isPlaying,
  setIsPlaying,
  videoRef,
  pictureInPictureCanvas,
  isPictureInPictureLyircsCanvas,
}: {
  currentlyPlaying: ITrack | undefined;
  currentlyPlayingPosition: number | undefined;
  player: Spotify.Player | AudioPlayer | undefined;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  videoRef: MutableRefObject<HTMLVideoElement | undefined>;
  pictureInPictureCanvas: MutableRefObject<HTMLCanvasElement | undefined>;
  isPictureInPictureLyircsCanvas: boolean;
}): void {
  const { user, isPremium } = useAuth();
  useEffect(() => {
    const duration = currentlyPlaying?.duration_ms;
    if (
      navigator.mediaSession &&
      "setPositionState" in navigator.mediaSession
    ) {
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
          setIsPlaying(true);
          if (!isPremium) {
            player?.togglePlay();
            return;
          }
          (player as Spotify.Player)?.resume();
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
        console.error("useMediaSession", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [currentlyPlaying, isPlaying, videoRef]);

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

    if (
      pictureInPictureCanvas.current &&
      videoRef.current &&
      document.pictureInPictureElement &&
      !isPictureInPictureLyircsCanvas
    ) {
      callPictureInPicture(pictureInPictureCanvas.current, videoRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyPlaying, isPictureInPictureLyircsCanvas, isPlaying]);
}
