import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { play } from "lib/spotify";
import { Dispatch, SetStateAction } from "react";
import {
  AllTracksFromAPlayList,
  normalTrackTypes,
  trackItem,
} from "types/spotify";

interface Config {
  allTracks: AllTracksFromAPlayList;
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | undefined;
  deviceId: string | undefined;
  playlistUri: string | undefined;
  player: AudioPlayer | Spotify.Player | undefined;
  setCurrentlyPlaying: Dispatch<SetStateAction<trackItem | undefined>>;
  playlistId: string | undefined;
  setPlaylistPlayingId: Dispatch<SetStateAction<string | undefined>>;
}

export async function playCurrentTrack(
  track: normalTrackTypes | undefined,
  {
    player,
    user,
    allTracks,
    accessToken,
    deviceId,
    playlistUri,
    setCurrentlyPlaying,
    playlistId,
    setPlaylistPlayingId,
  }: Config
): Promise<unknown> {
  const isPremium = user?.product === "premium";
  if (!isPremium && track?.audio) {
    (player as AudioPlayer).currentTime = 0;
    (player as AudioPlayer).src = track.audio;
    (player as AudioPlayer)?.play();
    (player as AudioPlayer).allTracks = allTracks;
    setCurrentlyPlaying(track);
    setPlaylistPlayingId(playlistId);
    return;
  }
  if (accessToken && track && deviceId) {
    const res = await play(accessToken, deviceId, {
      context_uri: playlistUri,
      offset: track.position,
    });
    setPlaylistPlayingId(playlistId);
    return res;
  }
  return setPlaylistPlayingId(playlistId);
}
