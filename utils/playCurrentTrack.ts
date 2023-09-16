import { Dispatch, SetStateAction } from "react";

import { BadRequestError, NotFoundError } from "./errors";
import { ContentType, ToastMessage } from "./getTranslations";
import { templateReplace } from "./templateReplace";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { ITrack } from "types/spotify";
import { NewToast } from "types/toast";
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
  isSingleTrack?: boolean;
  position?: number;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
  uri?: string;
  uris?: string[];
}

export function handlePlayCurrentTrackError(
  error: unknown,
  {
    player,
    addToast,
    setReconnectionError,
    translations,
  }: {
    player: Spotify.Player;
    addToast: (toast: NewToast) => void;
    setReconnectionError: (value: SetStateAction<boolean>) => void;
    translations: Record<string, string>;
  }
): void {
  if (NotFoundError.isThisError(error)) {
    player.disconnect();
    addToast({
      variant: "error",
      message: translations[ToastMessage.UnableToPlayReconnecting],
    });
    setReconnectionError(true);
  }

  if (BadRequestError.isThisError(error)) {
    addToast({
      variant: "error",
      message: templateReplace(translations[ToastMessage.ErrorPlayingThis], [
        translations[ContentType.Track],
      ]),
    });
  }
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
    isSingleTrack,
    position,
    setAccessToken,
    uri,
    uris,
  }: Config
): Promise<string | undefined> {
  const isPremium = user?.product === "premium";
  if (!isPremium && track?.preview_url) {
    (player as AudioPlayer).currentTime = 0;
    (player as AudioPlayer).src = track.preview_url;
    (player as AudioPlayer).play();
    (player as AudioPlayer).allTracks = allTracks;
    setCurrentlyPlaying(track);
    return playlistId;
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

    const res = await play(accessToken, deviceId, playConfig, setAccessToken);

    if (res.status === 404) {
      throw new NotFoundError();
    }
    if (res.ok) {
      return isSingleTrack ? undefined : playlistId;
    }
    throw new BadRequestError();
  }
  throw new BadRequestError();
}
