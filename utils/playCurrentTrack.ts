import { Dispatch, SetStateAction } from "react";

import { BadRequestError, NotFoundError } from "./errors";
import { ContentType, ToastMessage } from "./getTranslations";
import { templateReplace } from "./templateReplace";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { ITrack } from "types/spotify";
import { NewToast } from "types/toast";
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
  accessToken: string | undefined;
  deviceId: string | undefined;
  playlistUri: string | undefined;
  player: AudioPlayer | Spotify.Player | undefined;
  isSingleTrack?: boolean;
  position?: number;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
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
    accessToken,
    deviceId,
    playlistUri,
    isSingleTrack,
    position,
    setAccessToken,
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

  if (!accessToken || !deviceId) {
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

  const res = await play(accessToken, deviceId, playConfig, setAccessToken);

  if (res.ok) {
    return;
  }
  if (res.status === 404) {
    throw new NotFoundError();
  }
  throw new BadRequestError();
}
