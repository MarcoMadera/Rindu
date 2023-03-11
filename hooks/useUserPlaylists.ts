import { useEffect } from "react";

import { useAuth, useSpotify } from "hooks";
import { PlaylistItems } from "types/spotify";
import { getAllMyPlaylists } from "utils";

export default function useUserPlaylists(): PlaylistItems {
  const { playlists, setPlaylists } = useSpotify();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!playlists) {
      getAllMyPlaylists(accessToken as string).then((playlists) => {
        if (playlists) {
          setPlaylists(playlists.items);
        }
      });
    }
  }, [accessToken, playlists, setPlaylists]);

  return playlists;
}
