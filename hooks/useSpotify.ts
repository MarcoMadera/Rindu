import { useCallback, useContext } from "react";
import { UserPlaylistsResponse, ISpotifyContext } from "types/spotify";
import { getTracksFromPlayList as getTracksFromPlayListFromAPI } from "utils/spotifyCalls/getTracksFromPlayList";
import SpotifyContext from "../context/SpotifyContext";
import { getPlaylistsRequest, removeTracksRequest } from "../lib/requests";
import useAuth from "./useAuth";

export default function useSpotify(): ISpotifyContext & {
  getPlaylists: (offset: number, playlistLimit: number) => void;
  getTracksFromPlayList: (playlistId: string) => void;
  removeTracks: (
    playlist: string | undefined,
    tracks: number[],
    snapshotID: string | undefined
  ) => Promise<string | undefined>;
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
    playedSource,
    setPlayedSource,
    isShowingSideBarImg,
    setIsShowingSideBarImg,
    volume,
    setVolume,
    lastVolume,
    setLastVolume,
  } = useContext(SpotifyContext);
  const { user } = useAuth();

  const getPlaylists = useCallback(
    (offset: number, playlistLimit: number) => {
      getPlaylistsRequest(offset, playlistLimit, user?.country ?? "US")
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
    [setPlaylists, setTotalPlaylists, user?.country]
  );

  const getTracksFromPlayList = useCallback(
    (playlistId: string) => {
      setAllTracks([]);
      getTracksFromPlayListFromAPI(playlistId, user?.country ?? "US")
        .then((playlistDetails) => {
          return setAllTracks(playlistDetails?.tracks ?? []);
        })
        .catch((err: unknown) => {
          console.log(err);
        });
    },
    [setAllTracks, user?.country]
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
    playedSource,
    setPlayedSource,
    setTotalPlaylists,
    isShowingSideBarImg,
    setIsShowingSideBarImg,
    volume,
    setVolume,
    lastVolume,
    setLastVolume,
  };
}
