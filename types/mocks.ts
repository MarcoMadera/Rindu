import { ArtistsInfo } from "utils/getArtistInfo";
import { IRefreshAccessTokenResponse } from "utils/spotifyCalls/refreshAccessToken";
import { ITrack } from "./spotify";

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
  artistInfo: ArtistsInfo;
  refreshAccessTokenResponse: IRefreshAccessTokenResponse;
  setupCookies: (value?: string) => string;
  setupEnviroment: (value?: Record<string, string>) => string;
  mediaSession: MediaSession;
  setupMediaSession: (value?: MediaSession) => void;
  mockFetchSuccess: <T>(value?: T, ok?: boolean) => T;
  mockFetchError: <T>(value?: T) => T;
  rejectPromise: <T>(rejectedValue?: T) => Promise<unknown>;
  resolvePromise: <T>(resolvedValue?: T) => Promise<unknown>;
}
