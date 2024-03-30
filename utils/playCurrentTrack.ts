import { SetStateAction } from "react";

import { BadRequestError, NotFoundError } from "./errors";
import { templateReplace } from "./templateReplace";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { ITrack } from "types/spotify";
import { NewToast } from "types/toast";
import { ITranslations } from "types/translations";
import { play } from "utils/spotifyCalls";

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
    translations: ITranslations;
  }
): void {
  if (NotFoundError.isThisError(error)) {
    player.disconnect();
    addToast({
      variant: "error",
      message: translations.toastMessages.unableToPlayReconnecting,
    });
    setReconnectionError(true);
  }

  if (BadRequestError.isThisError(error)) {
    addToast({
      variant: "error",
      message: templateReplace(translations.toastMessages.errorPlayingThis, [
        translations.contentType.track,
      ]),
    });
  }
}

interface IhandleStandardPlay {
  player: AudioPlayer;
  previewUrl: string;
  allTracks: ITrack[];
}
function handleStandardPlay({
  player,
  previewUrl,
  allTracks,
}: IhandleStandardPlay) {
  player.currentTime = 0;
  player.src = previewUrl;
  player.play();
  player.allTracks = allTracks;
}

function filterTracksByUri(allTracks: ITrack[]) {
  const allTracksUris: string[] = [];
  const positionOfTracksWithoutUri: number[] = [];

  allTracks.forEach((track, i) => {
    if (track.uri) {
      allTracksUris.push(track.uri);
      return;
    }

    positionOfTracksWithoutUri.push(i);
  });

  return { allTracksUris, positionOfTracksWithoutUri };
}

interface IPlayConfig {
  allTracks: ITrack[];
  isPremium: boolean;
  deviceId: string | undefined;
  playlistUri: string | undefined;
  player: AudioPlayer | Spotify.Player | undefined;
  isSingleTrack?: boolean;
  position?: number;
  uri?: string;
  uris?: string[];
}

interface ITrackInfo {
  preview_url?: string | null;
  position?: number;
  uri?: string;
}

export async function playCurrentTrack(
  trackInfo: ITrackInfo,
  config: IPlayConfig
): Promise<string | undefined> {
  const {
    player,
    isPremium,
    allTracks,
    deviceId,
    playlistUri,
    isSingleTrack,
    position,
    uri,
    uris,
  } = config;

  if (!isPremium && trackInfo?.preview_url) {
    handleStandardPlay({
      player: player as AudioPlayer,
      allTracks,
      previewUrl: trackInfo.preview_url,
    });
    return;
  }

  if (!deviceId) {
    throw new BadRequestError();
  }

  const { allTracksUris, positionOfTracksWithoutUri } =
    filterTracksByUri(allTracks);

  const numberOfTracksWithoutUriLowerThanPosition =
    positionOfTracksWithoutUri.filter((p) => p < (position ?? 0)).length;
  const positionInUrisArray =
    (position ?? 0) - numberOfTracksWithoutUriLowerThanPosition;

  const singleTrackConfiguration = {
    uris: uris ?? (uri ? [uri] : allTracksUris),
    offset: uri ? 0 : positionInUrisArray,
  };

  const trackConfiguration = {
    context_uri: playlistUri,
    offset: trackInfo?.position ?? 0,
  };

  const playConfig = isSingleTrack
    ? singleTrackConfiguration
    : trackConfiguration;

  const res = await play(deviceId, playConfig);

  if (res.ok) {
    return;
  }
  if (res.status === 404) {
    throw new NotFoundError();
  }
  throw new BadRequestError();
}
