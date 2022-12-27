import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { Dispatch, SetStateAction } from "react";
import { ITrack, IPageDetails } from "types/spotify";
import { NewToast } from "types/toast";
import { play } from "./spotifyCalls/play";

export function getUris(
  isSingle?: boolean,
  allTracks?: ITrack[],
  trackUri?: string,
  uri?: string
): string[] {
  let uris = [];
  if (isSingle) {
    uris = trackUri ? [trackUri] : [];
  } else {
    const allTracksUris = allTracks ? allTracks.map((t) => t.uri) : [];
    const filteredUris = allTracksUris.filter(
      (t) => t !== null && t !== undefined
    ) as string[];

    uris = allTracks ? filteredUris : [];
  }
  const singleUri = trackUri || uri;
  if (uris.length === 0 && singleUri) {
    uris.push(singleUri);
  }
  return uris;
}

export function getPlayOptions(
  track?: ITrack,
  isSingle?: boolean,
  uri?: string,
  pageDetails?: IPageDetails | null,
  position?: number,
  allTracks?: ITrack[]
): { context_uri?: string; uris?: string[]; offset?: number } {
  if (track || isSingle) {
    return {
      uris: getUris(isSingle, allTracks, track?.uri, uri),
      offset: position ?? 0,
    };
  }
  return {
    context_uri: uri ?? pageDetails?.uri,
  };
}

export async function getCurrentState(
  player: Spotify.Player | undefined,
  addToast: (toast: NewToast) => void
): Promise<Spotify.PlaybackState | null> {
  if (!player) return null;
  if (!player.getCurrentState) {
    addToast({
      variant: "error",
      message: "Not ready to play, if the issue persist refresh the page",
    });
    return null;
  }
  const data = await player.getCurrentState();
  return data;
}

export async function handlePremiumPlay(
  player: Spotify.Player | undefined,
  deviceId: string,
  accessToken: string,
  addToast: (toast: NewToast) => void,
  setAccessToken: Dispatch<SetStateAction<string | undefined>>,
  setReconnectionError: Dispatch<SetStateAction<boolean>>,
  setPlaylistPlayingId: Dispatch<SetStateAction<string | undefined>>,
  setPlayedSource: Dispatch<SetStateAction<string | undefined>>,
  track?: ITrack,
  isSingle?: boolean,
  playlistPlayingId?: string,
  uriId?: string,
  pageDetails?: IPageDetails | null,
  uri?: string,
  isPlaying?: boolean,
  position?: number,
  allTracks?: ITrack[]
): Promise<void> {
  player?.activateElement();
  const playbackState = await getCurrentState(player, addToast);
  const trackWindowUri = playbackState?.track_window?.current_track?.uri;
  const contextUri = playbackState?.context.uri;
  const isThisTrack = trackWindowUri && trackWindowUri === track?.uri;
  const isThisPlaylist =
    playlistPlayingId && playlistPlayingId === uriId && !isSingle;
  const isThisArtist =
    contextUri && contextUri === pageDetails?.uri && !track && !uri;
  const isSameAsPlayback = isThisTrack || isThisPlaylist || isThisArtist;
  if (isSameAsPlayback) {
    isPlaying ? player?.pause() : player?.resume();
    return;
  }

  const playOptions = getPlayOptions(
    track,
    isSingle,
    uri,
    pageDetails,
    position,
    allTracks
  );

  const playRes = await play(
    accessToken,
    deviceId,
    playOptions,
    setAccessToken
  );

  if (playRes.status === 404) {
    player?.disconnect();
    addToast({
      variant: "error",
      message: "Unable to play, trying to reconnect, please wait...",
    });
    setReconnectionError(true);
  }

  if (playRes.ok) {
    setPlaylistPlayingId(uriId ?? pageDetails?.id);
    const source =
      track || isSingle
        ? track?.uri || pageDetails?.uri
        : uri ?? pageDetails?.uri;
    const isCollection = source?.split(":")?.[3];
    setPlayedSource(
      isCollection && pageDetails?.type && pageDetails?.id
        ? `spotify:${pageDetails?.type}:${pageDetails?.id}`
        : source
    );
  }
}

export function handleNonPremiumPlay(
  player: AudioPlayer | undefined,
  isThisTrackPlaying: boolean,
  isThisPlaylistPlaying: boolean,
  setIsPlaying: Dispatch<SetStateAction<boolean>>,
  setCurrentlyPlaying: Dispatch<SetStateAction<ITrack | undefined>>,
  setPlaylistPlayingId: Dispatch<SetStateAction<string | undefined>>,
  allTracks: ITrack[],
  pageDetails?: IPageDetails | null,
  track?: ITrack
): void {
  if (!player) return;
  if (isThisTrackPlaying || (pageDetails && isThisPlaylistPlaying && !track)) {
    player?.togglePlay();
    return;
  }
  player.allTracks = allTracks;
  if (track) {
    setIsPlaying(false);
    player.allTracks = [track];
  }
  if (track?.preview_url || allTracks[0]?.preview_url) {
    const audio = track?.preview_url || allTracks[0].preview_url;
    player.src = audio as string;
    player.play();
    setCurrentlyPlaying(track || allTracks[0]);
  } else {
    player.nextTrack();
  }
  if (pageDetails) {
    setPlaylistPlayingId(pageDetails.id);
  }
}
