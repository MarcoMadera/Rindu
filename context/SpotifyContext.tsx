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
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
