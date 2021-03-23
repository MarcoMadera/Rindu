import { useCallback, useContext } from "react";
import {
  AllTracksFromAPlayList,
  PlaylistItems,
  RemoveTracksResponse,
  UserPlaylistsResponse,
  AllTracksFromAPlaylistResponse,
} from "../lib/types";
import SpotifyContext from "../context/SpotifyContext";

export default function useSpotify(
  accessToken?: string | undefined
): {
  playlists: PlaylistItems;
  totalPlaylists: number;
  getPlaylists: (offset: number, playlistLimit: number) => void;
  getTracksFromPlayList: (playlistId: string) => void;
  allTracks: AllTracksFromAPlayList;
  removeTracks: (
    playlist: string | undefined,
    tracks: number[],
    snapshotID: string | undefined
  ) => Promise<RemoveTracksResponse>;
} {
  const {
    playlists,
    totalPlaylists,
    setTotalPlaylists,
    setPlaylists,
    setAllTracks,
    allTracks,
  } = useContext(SpotifyContext);

  const getPlaylists = useCallback(
    (offset, playlistLimit) => {
      fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken,
          offset: offset,
          playlistLimit,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res;
        })
        .then((d) => d.json())
        .then(({ items, total }: UserPlaylistsResponse) => {
          setTotalPlaylists(total);
          return setPlaylists((playlist) => [...playlist, ...items]);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [accessToken, setPlaylists, setTotalPlaylists]
  );

  const getTracksFromPlayList = useCallback(
    (playlistId) => {
      setAllTracks([]);
      fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken,
          playlistId,
        }),
      })
        .then((d) => d.json())
        .then(({ tracks }: AllTracksFromAPlaylistResponse) => {
          return setAllTracks(tracks);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [accessToken, setAllTracks]
  );

  const removeTracks = useCallback(
    async (
      playlist: string | undefined,
      tracks: number[],
      snapshotID: string | undefined
    ) => {
      try {
        const res = await fetch("/api/removetracks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken,
            playlist,
            tracks,
            snapshotID,
          }),
        });
        if (!res.ok) {
          throw Error(res.statusText);
        }
        const snapshot_id: string = await res.json();
        return snapshot_id;
      } catch (err) {
        console.log(err);
        return;
      }
    },
    [accessToken]
  );

  return {
    playlists,
    totalPlaylists,
    getPlaylists,
    getTracksFromPlayList,
    allTracks,
    removeTracks,
  };
}
