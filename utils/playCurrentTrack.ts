import { Dispatch, SetStateAction } from "react";

import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { ITrack } from "types/spotify";
import { play } from "utils/spotifyCalls";

interface Config {
  allTracks: ITrack[];
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | undefined;
  deviceId: string | undefined;
  playlistUri: string | undefined;
  player: AudioPlayer | Spotify.Player | undefined;
  setCurrentlyPlaying: Dispatch<SetStateAction<ITrack | undefined>>;
  playlistId: string | undefined;
  setPlaylistPlayingId: Dispatch<SetStateAction<string | undefined>>;
  isSingleTrack?: boolean;
  position?: number;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
  uri?: string;
  uris?: string[];
}

export async function playCurrentTrack(
  track: ITrack | undefined,
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
    isSingleTrack,
    position,
    setAccessToken,
    uri,
    uris,
  }: Config
): Promise<number> {
  const isPremium = user?.product === "premium";
  if (!isPremium && track?.preview_url) {
    (player as AudioPlayer).currentTime = 0;
    (player as AudioPlayer).src = track.preview_url;
    (player as AudioPlayer).play();
    (player as AudioPlayer).allTracks = allTracks;
    setCurrentlyPlaying(track);
    setPlaylistPlayingId(playlistId);
    return 200;
  }

  if (accessToken && track && deviceId) {
    const allTracksUris: string[] = [];
    const positionOfTracksWithoutUri: number[] = [];
    allTracks.forEach((track, i) => {
      if (track.uri) {
        allTracksUris.push(track.uri);
      } else {
        positionOfTracksWithoutUri.push(i);
      }
    });
    const numberOfTracksWithoutUriLowerThanPosition =
      positionOfTracksWithoutUri.filter((p) => p < (position || 0)).length;
    const positionInUrisArray =
      (position || 0) - numberOfTracksWithoutUriLowerThanPosition;

    const playConfig = isSingleTrack
      ? {
          uris: uris ?? (uri ? [uri] : allTracksUris),
          offset: uri ? 0 : positionInUrisArray,
        }
      : {
          context_uri: playlistUri,
          offset: track.position,
        };

    const playStatus = await play(
      accessToken,
      deviceId,
      playConfig,
      setAccessToken
    ).then((res) => {
      if (res.status === 404) {
        return 404;
      }
      if (res.ok) {
        setPlaylistPlayingId(isSingleTrack ? undefined : playlistId);
        return 200;
      }
      return 400;
    });
    return playStatus;
  }
  return 400;
}
