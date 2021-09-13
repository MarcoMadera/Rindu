import { createContext, Dispatch, SetStateAction, useState } from "react";
import { AllTracksFromAPlayList, PlaylistItems } from "types/spotify";

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
  setCurrentlyPlaying: Dispatch<SetStateAction<Spotify.Track | undefined>>;
  currrentlyPlaying: Spotify.Track | undefined;
  currentlyPlayingPosition: number | undefined;
  currentlyPlayingDuration: number | undefined;
  setCurrentlyPlayingPosition: Dispatch<SetStateAction<number | undefined>>;
  setCurrentlyPlayingDuration: Dispatch<SetStateAction<number | undefined>>;
  player: Spotify.Player | undefined;
  setPlayer: Dispatch<SetStateAction<Spotify.Player | undefined>>;
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
  const [currrentlyPlaying, setCurrentlyPlaying] = useState<Spotify.Track>();
  const [currentlyPlayingPosition, setCurrentlyPlayingPosition] =
    useState<number>();
  const [currentlyPlayingDuration, setCurrentlyPlayingDuration] =
    useState<number>();
  const [player, setPlayer] = useState<Spotify.Player>();

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
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
