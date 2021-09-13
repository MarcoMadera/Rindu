import { Dispatch, SetStateAction, useCallback, useContext } from "react";
import {
  AllTracksFromAPlayList,
  PlaylistItems,
  RemoveTracksResponse,
  UserPlaylistsResponse,
  AllTracksFromAPlaylistResponse,
} from "types/spotify";
import SpotifyContext from "../context/SpotifyContext";
import {
  getPlaylistsRequest,
  getTracksFromPlayListRequest,
  removeTracksRequest,
} from "../lib/requests";

export default function useSpotify(): {
  playlists: PlaylistItems;
  totalPlaylists: number;
  getPlaylists: (offset: number, playlistLimit: number) => void;
  getTracksFromPlayList: (playlistId: string) => void;
  allTracks: AllTracksFromAPlayList;
  setPlaylists: Dispatch<SetStateAction<PlaylistItems>>;
  deviceId: string | undefined;
  setDeviceId: Dispatch<SetStateAction<string | undefined>>;
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
  } = useContext(SpotifyContext);

  const getPlaylists = useCallback(
    (offset: number, playlistLimit: number) => {
      getPlaylistsRequest(offset, playlistLimit)
        .then((res) => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res;
        })
        .then((d) => d.json())
        .then(({ items, total }: UserPlaylistsResponse) => {
          setTotalPlaylists(total);
          setPlaylists((playlist) => [...playlist, ...items]);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [setPlaylists, setTotalPlaylists]
  );

  const getTracksFromPlayList = useCallback(
    (playlistId: string) => {
      setAllTracks([]);
      getTracksFromPlayListRequest(playlistId)
        .then((d) => d.json())
        .then(({ tracks }: AllTracksFromAPlaylistResponse) => {
          return setAllTracks(tracks);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [setAllTracks]
  );

  const removeTracks = useCallback(
    async (
      playlist: string | undefined,
      tracks: number[],
      snapshotID: string | undefined
    ) => {
      try {
        const res = await removeTracksRequest(playlist, tracks, snapshotID);
        if (!res.ok) {
          throw Error(res.statusText);
        }
        const { snapshot_id }: { snapshot_id: string } = await res.json();
        return snapshot_id;
      } catch (err) {
        console.log(err);
        return;
      }
    },
    []
  );

  return {
    playlists,
    totalPlaylists,
    getPlaylists,
    getTracksFromPlayList,
    allTracks,
    removeTracks,
    setPlaylists,
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
  };
}
