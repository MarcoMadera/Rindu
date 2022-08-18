import { ITrack, PlaylistItem } from "types/spotify";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "utils/constants";
import { ArtistsInfo } from "utils/getArtistInfo";

export const accessToken = "accessToken";
export const refreshToken = "refreshToken";
export const expiresIn = 3600;

export const authCookies = `${ACCESS_TOKEN_COOKIE}=${accessToken}; max-age=1000; Path=/; SameSite=lax; Secure; ${REFRESH_TOKEN_COOKIE}=${refreshToken}; max-age=1000; Path=/; SameSite=lax; Secure; ${EXPIRE_TOKEN_COOKIE}=${expiresIn}; max-age=1000; Path=/; SameSite=lax; Secure;`;

export const paginObject: SpotifyApi.PagingObject<never> = {
  href: "href",
  items: [],
  limit: 50,
  next: "next",
  offset: 0,
  previous: "previous",
  total: 0,
};

export const user: SpotifyApi.CurrentUsersProfileResponse = {
  birthdate: "1994-12-05",
  country: "US",
  display_name: "John Doe",
  email: "mail@mail.com",
  external_urls: { spotify: "spotify" },
  product: "premium",
  href: "href",
  id: "id",
  uri: "spotify:user:id",
  type: "user",
};

export const artist: SpotifyApi.ArtistObjectSimplified = {
  name: "artist",
  external_urls: { spotify: "spotify" },
  href: "href",
  id: "id",
  uri: "uri",
  type: "artist",
};

export const albumFull: SpotifyApi.AlbumObjectFull = {
  name: "albumName",
  images: [{ url: "albumUrl" }],
  album_type: "album",
  artists: [artist],
  copyrights: [{ text: "copyrightText", type: "C" }],
  external_ids: { isrc: "isrc" },
  external_urls: { spotify: "spotifyUrl" },
  genres: ["genre"],
  release_date: "releaseDate",
  total_tracks: 10,
  href: "href",
  id: "id",
  type: "album",
  label: "label",
  popularity: 10,
  tracks: paginObject,
  release_date_precision: "day",
  uri: "uri",
};

export const savedAlbum: SpotifyApi.SavedAlbumObject = {
  album: albumFull,
  added_at: "addedAt",
};

export const simplePlaylist: PlaylistItem = {
  collaborative: false,
  description: "playlist description",
  external_urls: { spotify: "spotifyurl" },
  href: "href",
  id: "playlist id",
  images: [{ url: "url", height: 300, width: 300 }],
  name: "playlist name",
  owner: user,
  public: true,
  snapshot_id: "snapshot_id",
  tracks: { href: "tracks href", total: 50 },
  type: "playlist",
  uri: "uri",
};

export const trackFull: SpotifyApi.TrackObjectFull = {
  id: "id",
  name: "name",
  artists: [artist],
  duration_ms: 1000,
  preview_url: "https://preview.com",
  album: albumFull,
  explicit: false,
  is_local: false,
  is_playable: true,
  type: "track",
  uri: "spotify:track:id",
  external_ids: { isrc: "isrc" },
  external_urls: { spotify: "spotify:track:id" },
  popularity: 0,
  href: "href",
  disc_number: 0,
  track_number: 0,
};

export const track: ITrack = {
  ...trackFull,
  position: 0,
  corruptedTrack: false,
};

export const playlistTrackResponse: SpotifyApi.PlaylistTrackObject = {
  added_at: "2020-01-01T00:00:00.000Z",
  added_by: user,
  is_local: false,
  track: trackFull,
};

export const artistInfo: ArtistsInfo = {
  artists: [
    {
      idArtist: "",
      strArtist: "",
      strArtistStripped: null,
      strArtistAlternate: "",
      strLabel: "",
      idLabel: "",
      intFormedYear: "",
      intBornYear: "",
      intDiedYear: null,
      strDisbanded: null,
      strStyle: "",
      strGenre: "",
      strMood: "",
      strWebsite: "",
      strFacebook: "",
      strTwitter: "",
      strGender: "",
      intMembers: "",
      strCountry: "",
      strCountryCode: "",
      strArtistThumb: "",
      strArtistLogo: "",
      strArtistCutout: "",
      strArtistClearart: "",
      strArtistWideThumb: "",
      strArtistFanart: "",
      strArtistFanart2: "",
      strArtistFanart3: "",
      strArtistFanart4: "",
      strArtistBanner: "",
      strMusicBrainzID: "",
      strISNIcode: null,
      strLastFMChart: "",
      intCharted: "",
      strLocked: "",
      strBiographyEN: "",
      strBiographyDE: "",
      strBiographyFR: "",
      strBiographyCN: "",
      strBiographyIT: "",
      strBiographyJP: "",
      strBiographyRU: "",
      strBiographyES: "",
      strBiographyPT: "",
      strBiographySE: "",
      strBiographyNL: "",
      strBiographyHU: "",
      strBiographyNO: "",
      strBiographyIL: "",
      strBiographyPL: "",
    },
  ],
};

export const refreshAccessTokenResponse = {
  access_token: accessToken,
  refresh_token: refreshToken,
  expires_in: expiresIn,
};

export function setupCookies(value?: string): string {
  const preparedValue = value ?? authCookies;
  Object.defineProperty(document, "cookie", {
    writable: true,
    value: preparedValue,
  });
  return preparedValue;
}

export function setupEnviroment(
  value?: Record<string, string>
): Record<string, string> {
  const preparedValue = value ?? {
    NODE_ENV: "development",
  };
  Object.defineProperty(global.process, "env", {
    writable: true,
    value: preparedValue,
  });
  return preparedValue;
}

export const mediaSession: MediaSession = {
  metadata: {
    title: "title",
    artist: "artist",
    album: "album",
    artwork: [
      { src: "https://image.com", sizes: "100x100", type: "image/png" },
    ],
  },
  playbackState: "playing",
  setActionHandler: (action, handler) => {
    action;
    handler;
  },
  setPositionState: (state) => {
    state;
  },
};

export function setupMediaSession(value?: MediaSession): MediaSession {
  const preparedValue = value ?? mediaSession;
  Object.defineProperty(window.navigator, "mediaSession", {
    writable: true,
    value: preparedValue,
  });
  return preparedValue;
}

export function mockFetchSuccess<T>(value?: T, ok?: boolean): T | undefined {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => value,
      ok: ok ?? true,
    })
  ) as unknown as () => Promise<Response>;

  return value;
}

export function mockFetchError<T>(value?: T): T | undefined {
  global.fetch = jest.fn(() =>
    Promise.reject({
      json: () => value,
      ok: false,
    })
  ) as unknown as () => Promise<Response>;

  return value;
}

export function rejectPromise<T>(rejectedValue?: T): Promise<unknown> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(rejectedValue);
    }, 30);
  });
}

export function resolvePromise<T>(resolvedValue?: T): Promise<unknown> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(resolvedValue), 100)
  );
}
