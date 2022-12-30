import { useEffect } from "react";
import { PlaylistItems } from "types/spotify";
import { getCurrentUserPlaylists } from "utils/getAllMyPlaylists";
import useAuth from "./useAuth";
import useSpotify from "./useSpotify";

export default function useUserPlaylists(): PlaylistItems {
  const { playlists, setPlaylists } = useSpotify();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!playlists) {
      getCurrentUserPlaylists(accessToken as string).then((playlists) => {
        if (playlists) {
          setPlaylists(playlists.items);
        }
      });
    }
  }, [accessToken, playlists, setPlaylists]);

  return playlists;
}
