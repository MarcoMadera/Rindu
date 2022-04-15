import useAuth from "hooks/useAuth";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { createContext, useEffect, useState } from "react";
import {
  AllTracksFromAPlayList,
  ISpotifyContext,
  PlaylistItems,
  trackItem,
} from "types/spotify";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SpotifyContext = createContext<ISpotifyContext>(null!);
export default SpotifyContext;

export const SpotifyContextProvider: React.FC = ({ children }) => {
  const [playlists, setPlaylists] = useState<PlaylistItems>([]);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [allTracks, setAllTracks] = useState<AllTracksFromAPlayList>([]);
  const [deviceId, setDeviceId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSideBarImg, setIsShowingSideBarImg] = useState(false);
  const [currrentlyPlaying, setCurrentlyPlaying] = useState<trackItem>();
  const [currentlyPlayingPosition, setCurrentlyPlayingPosition] =
    useState<number>();
  const [currentlyPlayingDuration, setCurrentlyPlayingDuration] =
    useState<number>();
  const [player, setPlayer] = useState<Spotify.Player | AudioPlayer>();
  const [playlistPlayingId, setPlaylistPlayingId] = useState<string>();
  const [playedSource, setPlayedSource] = useState<string>();
  const [playlistDetails, setPlaylistDetails] =
    useState<ISpotifyContext["playlistDetails"]>(null);
  const [volume, setVolume] = useState<number>(1);
  const [lastVolume, setLastVolume] = useState<number>(1);
  const { user } = useAuth();

  useEffect(() => {
    if (
      "setPositionState" in navigator.mediaSession &&
      currrentlyPlaying?.duration
    ) {
      navigator.mediaSession.setPositionState({
        duration: currrentlyPlaying.duration,
        playbackRate: 1,
        position:
          currentlyPlayingPosition &&
          currentlyPlayingPosition <= currrentlyPlaying.duration
            ? currentlyPlayingPosition
            : 0,
      });
    }
  }, [currentlyPlayingPosition, currrentlyPlaying?.duration]);

  useEffect(() => {
    if (player && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", function () {
          player.togglePlay();
        });
        navigator.mediaSession.setActionHandler("pause", function () {
          player.togglePlay();
        });
        navigator.mediaSession.setActionHandler("stop", function () {
          player.pause();
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
  }, [currentlyPlayingPosition, player, user]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      if (isPlaying) {
        navigator.mediaSession.playbackState = "playing";
      }
      if (!isPlaying) {
        navigator.mediaSession.playbackState = "paused";
      }
      if (!isPlaying && !currrentlyPlaying) {
        navigator.mediaSession.playbackState = "none";
      }
    }
  }, [currrentlyPlaying, isPlaying]);

  return (
    <SpotifyContext.Provider
      value={{
        playlists,
        totalPlaylists,
        allTracks,
        setPlaylists,
        setTotalPlaylists,
        setAllTracks,
        deviceId,
        setDeviceId,
        setIsPlaying,
        isPlaying,
        setCurrentlyPlaying,
        currrentlyPlaying,
        currentlyPlayingPosition,
        currentlyPlayingDuration,
        setCurrentlyPlayingPosition,
        setCurrentlyPlayingDuration,
        player,
        setPlayer,
        playlistPlayingId,
        setPlaylistPlayingId,
        playlistDetails,
        setPlaylistDetails,
        playedSource,
        setPlayedSource,
        isShowingSideBarImg,
        setIsShowingSideBarImg,
        volume,
        setVolume,
        lastVolume,
        setLastVolume,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
