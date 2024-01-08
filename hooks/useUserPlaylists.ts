import { useEffect } from "react";

import { useSpotify } from "hooks";
import { PlaylistItems } from "types/spotify";
import { getAllMyPlaylists } from "utils";

export function useUserPlaylists(): PlaylistItems {
  const { playlists, setPlaylists } = useSpotify();

  useEffect(() => {
    if (!playlists) {
      getAllMyPlaylists().then((playlists) => {
        if (playlists) {
          setPlaylists(playlists.items);
        }
      });
    }
  }, [playlists, setPlaylists]);

  return playlists;
}
