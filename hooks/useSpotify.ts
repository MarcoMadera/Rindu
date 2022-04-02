import { Dispatch, SetStateAction, useCallback, useContext } from "react";
import {
  AllTracksFromAPlayList,
  PlaylistItems,
  RemoveTracksResponse,
  UserPlaylistsResponse,
  trackItem,
} from "types/spotify";
import { getTracksFromPlayList as getTracksFromPlayListFromAPI } from "utils/spotifyCalls/getTracksFromPlayList";
import SpotifyContext from "../context/SpotifyContext";
import { getPlaylistsRequest, removeTracksRequest } from "../lib/requests";
import { AudioPlayer } from "./useSpotifyPlayer";

export default function useSpotify(): {
  playlists: PlaylistItems;
  totalPlaylists: number;
  getPlaylists: (offset: number, playlistLimit: number) => void;
  getTracksFromPlayList: (playlistId: string) => void;
  allTracks: AllTracksFromAPlayList;
  setAllTracks: Dispatch<SetStateAction<AllTracksFromAPlayList>>;
  setPlaylists: Dispatch<SetStateAction<PlaylistItems>>;
  deviceId: string | undefined;
  setDeviceId: Dispatch<SetStateAction<string | undefined>>;
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
    setPlaylistPlayingId,
    playlistPlayingId,
    playlistDetails,
    setPlaylistDetails,
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
      getTracksFromPlayListFromAPI(playlistId)
        .then((playlistDetails) => {
          return setAllTracks(playlistDetails?.tracks ?? []);
        })
        .catch((err: unknown) => {
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
    setAllTracks,
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
    playlistDetails,
    setPlaylistPlayingId,
    playlistPlayingId,
    setPlaylistDetails,
  };
}
