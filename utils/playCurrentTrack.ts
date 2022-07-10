import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { play } from "lib/spotify";
import { Dispatch, SetStateAction } from "react";
import { ITrack } from "types/spotify";

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
  uri?: string | undefined;
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
  }: Config
): Promise<number> {
  const isPremium = user?.product === "premium";
  if (!isPremium && track?.preview_url) {
    (player as AudioPlayer).currentTime = 0;
    (player as AudioPlayer).src = track.preview_url;
    (player as AudioPlayer)?.play();
    (player as AudioPlayer).allTracks = allTracks;
    setCurrentlyPlaying(track);
    setPlaylistPlayingId(playlistId);
    return 200;
  }

  if (accessToken && track && deviceId) {
    const uris: string[] = [];
    allTracks.forEach((track) => {
      if (track.uri) {
        uris.push(track.uri);
      }
    });
    const playConfig = isSingleTrack
      ? {
          uris: uri ? [uri] : uris,
          offset: uri ? 0 : position,
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
