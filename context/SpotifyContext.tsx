import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { createContext, Dispatch, SetStateAction, useState } from "react";
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
  playlistDetails: SpotifyApi.SinglePlaylistResponse | undefined;
  setPlaylistPlayingId: Dispatch<SetStateAction<string | undefined>>;
  playlistPlayingId: string | undefined;
  setPlaylistDetails: Dispatch<
    SetStateAction<SpotifyApi.SinglePlaylistResponse | undefined>
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
  const [playlistDetails, setPlaylistDetails] = useState<
    SpotifyApi.SinglePlaylistResponse | undefined
  >();

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
