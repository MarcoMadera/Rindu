import { NextRouter } from "next/router";

import { ITranslations } from "./translations";
import { ITrack } from "types/spotify";
import { ArtistScrobbleInfo, Locale } from "utils";
import { IRefreshAccessTokenResponse } from "utils/spotifyCalls/refreshAccessToken";

export interface IUtilsMocks {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  authCookies: string;
  paginObject: SpotifyApi.PagingObject<never>;
  user: SpotifyApi.CurrentUsersProfileResponse;
  artist: SpotifyApi.ArtistObjectSimplified;
  albumFull: SpotifyApi.AlbumObjectFull;
  savedAlbum: SpotifyApi.SavedAlbumObject;
  trackFull: SpotifyApi.TrackObjectFull;
  track: ITrack;
  playlistTrackResponse: SpotifyApi.PlaylistTrackObject;
  artistInfo: ArtistScrobbleInfo;
  refreshAccessTokenResponse: IRefreshAccessTokenResponse;
  setupCookies: (value?: string) => string;
  setupEnvironment: (value?: Record<string, string>) => string;
  mediaSession: MediaSession;
  setupMediaSession: (value?: MediaSession) => void;
  mockFetchSuccess: <T>(value?: T, ok?: boolean) => T;
  mockFetchError: <T>(value?: T) => T;
  rejectPromise: <T>(rejectedValue?: T) => Promise<unknown>;
  resolvePromise: <T>(resolvedValue?: T) => Promise<unknown>;
  mockPlaylistTrackResponse: SpotifyApi.PlaylistTrackResponse;
  getAllTranslations: (language: Locale) => ITranslations;
  nextRouterMock: NextRouter;
}
