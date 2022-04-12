import useAuth from "hooks/useAuth";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  AllTracksFromAPlayList,
  PlaylistItems,
  trackItem,
} from "types/spotify";

export interface Context {
  playlists: PlaylistItems;
  setPlaylists: Dispatch<SetStateAction<PlaylistItems>>;
  totalPlaylists: number;
  setTotalPlaylists: Dispatch<SetStateAction<number>>;
  deviceId: string | undefined;
  setDeviceId: Dispatch<SetStateAction<string | undefined>>;
  allTracks: AllTracksFromAPlayList;
  setAllTracks: Dispatch<SetStateAction<AllTracksFromAPlayList>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  isPlaying: boolean;
  setCurrentlyPlaying: Dispatch<SetStateAction<trackItem | undefined>>;
  currrentlyPlaying: trackItem | undefined;
  currentlyPlayingPosition: number | undefined;
  currentlyPlayingDuration: number | undefined;
  setCurrentlyPlayingPosition: Dispatch<SetStateAction<number | undefined>>;
  setCurrentlyPlayingDuration: Dispatch<SetStateAction<number | undefined>>;
  player: Spotify.Player | AudioPlayer | undefined;
  setPlayer: Dispatch<SetStateAction<Spotify.Player | AudioPlayer | undefined>>;
  playlistDetails: SpotifyApi.SinglePlaylistResponse | null;
  setPlaylistPlayingId: Dispatch<SetStateAction<string | undefined>>;
  playlistPlayingId: string | undefined;
  setPlaylistDetails: Dispatch<
    SetStateAction<SpotifyApi.SinglePlaylistResponse | null>
  >;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SpotifyContext = createContext<Context>(null!);
export default SpotifyContext;

export const SpotifyContextProvider: React.FC = ({ children }) => {
  const [playlists, setPlaylists] = useState<PlaylistItems>([]);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [allTracks, setAllTracks] = useState<AllTracksFromAPlayList>([]);
  const [deviceId, setDeviceId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currrentlyPlaying, setCurrentlyPlaying] = useState<trackItem>();
  const [currentlyPlayingPosition, setCurrentlyPlayingPosition] =
    useState<number>();
  const [currentlyPlayingDuration, setCurrentlyPlayingDuration] =
    useState<number>();
  const [player, setPlayer] = useState<Spotify.Player | AudioPlayer>();
  const [playlistPlayingId, setPlaylistPlayingId] = useState<string>();
  const [playlistDetails, setPlaylistDetails] =
    useState<SpotifyApi.SinglePlaylistResponse | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (
      "setPositionState" in navigator.mediaSession &&
      currrentlyPlaying?.duration
    ) {
      navigator.mediaSession.setPositionState({
        duration: currrentlyPlaying.duration,
        playbackRate: 1,
        position: currentlyPlayingPosition ?? 0,
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
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
