import translations from "i18n";
import { ITrack, PlaylistItem } from "types/spotify";
import { ITranslations } from "types/translations";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "utils/constants";
import { ArtistScrobbleInfo } from "utils/getArtistScrobbleInfo";
import { Locale } from "utils/locale";

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

export const artistInfo: ArtistScrobbleInfo = {
  name: "artist",
  image: [{ "#text": "url", size: "large" }],
  tags: { tag: [{ name: "tag", url: "url" }] },
  bio: {
    links: {
      link: {
        "#text": "text",
        href: "href",
        rel: "rel",
      },
    },
    published: "published",
    summary: "summary",
    content: "content",
  },
  similar: { artist: [] },
  ontour: "0",
  stats: { listeners: "0", playcount: "0" },
  url: "url",
  streamable: "0",
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

export function setupEnvironment(
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
    console.info("setActionHandler: ", action, handler);
  },
  setPositionState: (state) => {
    console.info("setPositionState: ", state);
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

export function resolvePromise<T>(
  resolvedValue?: T,
  duration = 100
): Promise<unknown> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(resolvedValue), duration)
  );
}

export function getAllTranslations(locale: Locale): ITranslations {
  return translations[locale];
}

export const mockPlaylistTrackResponse = {
  href: "https://api.spotify.com/v1/me/tracks",
  items: [
    {
      added_at: "2023-03-25T14:40:48Z",
      track: {
        album: {
          album_group: "single",
          album_type: "single",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/5qOORCmdl34SsKnB8o4aaF",
              },
              href: "https://api.spotify.com/v1/artists/5qOORCmdl34SsKnB8o4aaF",
              id: "5qOORCmdl34SsKnB8o4aaF",
              name: "22december",
              type: "artist",
              uri: "spotify:artist:5qOORCmdl34SsKnB8o4aaF",
            },
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/2urobxol2zYHXOUJXDh8n4",
              },
              href: "https://api.spotify.com/v1/artists/2urobxol2zYHXOUJXDh8n4",
              id: "2urobxol2zYHXOUJXDh8n4",
              name: "Shady Moon",
              type: "artist",
              uri: "spotify:artist:2urobxol2zYHXOUJXDh8n4",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/1EEKcUdS6QxuVMBFcK224N",
          },
          href: "https://api.spotify.com/v1/albums/1EEKcUdS6QxuVMBFcK224N",
          id: "1EEKcUdS6QxuVMBFcK224N",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b273c01b9cc4c00d3a2ce2a593e6",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e02c01b9cc4c00d3a2ce2a593e6",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d00004851c01b9cc4c00d3a2ce2a593e6",
              width: 64,
            },
          ],
          is_playable: true,
          name: "chinatown!",
          release_date: "2021-05-21",
          release_date_precision: "day",
          total_tracks: 1,
          type: "album",
          uri: "spotify:album:1EEKcUdS6QxuVMBFcK224N",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5qOORCmdl34SsKnB8o4aaF",
            },
            href: "https://api.spotify.com/v1/artists/5qOORCmdl34SsKnB8o4aaF",
            id: "5qOORCmdl34SsKnB8o4aaF",
            name: "22december",
            type: "artist",
            uri: "spotify:artist:5qOORCmdl34SsKnB8o4aaF",
          },
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/2urobxol2zYHXOUJXDh8n4",
            },
            href: "https://api.spotify.com/v1/artists/2urobxol2zYHXOUJXDh8n4",
            id: "2urobxol2zYHXOUJXDh8n4",
            name: "Shady Moon",
            type: "artist",
            uri: "spotify:artist:2urobxol2zYHXOUJXDh8n4",
          },
        ],
        disc_number: 1,
        duration_ms: 145115,
        explicit: true,
        external_ids: {
          isrc: "QZHN72117465",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/4JipCNXiKHe9LiKqMQr5w7",
        },
        href: "https://api.spotify.com/v1/tracks/4JipCNXiKHe9LiKqMQr5w7",
        id: "4JipCNXiKHe9LiKqMQr5w7",
        is_local: false,
        is_playable: true,
        name: "chinatown!",
        popularity: 69,
        preview_url:
          "https://p.scdn.co/mp3-preview/98332f2f78f20a762ee6799ef999d4447069d8d4?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 1,
        type: "track",
        uri: "spotify:track:4JipCNXiKHe9LiKqMQr5w7",
      },
    },
    {
      added_at: "2023-03-20T15:42:45Z",
      track: {
        album: {
          album_group: "album",
          album_type: "album",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/6omOLYD5hxNLkr99LQFRAb",
              },
              href: "https://api.spotify.com/v1/artists/6omOLYD5hxNLkr99LQFRAb",
              id: "6omOLYD5hxNLkr99LQFRAb",
              name: "Tao H",
              type: "artist",
              uri: "spotify:artist:6omOLYD5hxNLkr99LQFRAb",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/3U2yMohzlUUB0w9AdiRdp1",
          },
          href: "https://api.spotify.com/v1/albums/3U2yMohzlUUB0w9AdiRdp1",
          id: "3U2yMohzlUUB0w9AdiRdp1",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b273c82558d34949d39306f6616e",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e02c82558d34949d39306f6616e",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d00004851c82558d34949d39306f6616e",
              width: 64,
            },
          ],
          is_playable: true,
          name: "Dreamer",
          release_date: "2017-06-04",
          release_date_precision: "day",
          total_tracks: 11,
          type: "album",
          uri: "spotify:album:3U2yMohzlUUB0w9AdiRdp1",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6omOLYD5hxNLkr99LQFRAb",
            },
            href: "https://api.spotify.com/v1/artists/6omOLYD5hxNLkr99LQFRAb",
            id: "6omOLYD5hxNLkr99LQFRAb",
            name: "Tao H",
            type: "artist",
            uri: "spotify:artist:6omOLYD5hxNLkr99LQFRAb",
          },
        ],
        disc_number: 1,
        duration_ms: 336010,
        explicit: false,
        external_ids: {
          isrc: "FR2W01610081",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/2JsHzQPt9Xo07ApvilvdpZ",
        },
        href: "https://api.spotify.com/v1/tracks/2JsHzQPt9Xo07ApvilvdpZ",
        id: "2JsHzQPt9Xo07ApvilvdpZ",
        is_local: false,
        is_playable: true,
        name: "Psytribechoristes",
        popularity: 40,
        preview_url:
          "https://p.scdn.co/mp3-preview/5f1bc2fecac537ad88ad964f4dc13a122c4195ad?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 6,
        type: "track",
        uri: "spotify:track:2JsHzQPt9Xo07ApvilvdpZ",
      },
    },
    {
      added_at: "2023-03-19T05:20:13Z",
      track: {
        album: {
          album_group: "single",
          album_type: "single",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/5xdY3QW64ss1OdFkO1NAIr",
              },
              href: "https://api.spotify.com/v1/artists/5xdY3QW64ss1OdFkO1NAIr",
              id: "5xdY3QW64ss1OdFkO1NAIr",
              name: "Mista Flip",
              type: "artist",
              uri: "spotify:artist:5xdY3QW64ss1OdFkO1NAIr",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/6yXgCYUIy58TfKwGxFfmBL",
          },
          href: "https://api.spotify.com/v1/albums/6yXgCYUIy58TfKwGxFfmBL",
          id: "6yXgCYUIy58TfKwGxFfmBL",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b273864ecc4b77c453510a5733ce",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e02864ecc4b77c453510a5733ce",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d00004851864ecc4b77c453510a5733ce",
              width: 64,
            },
          ],
          is_playable: true,
          name: "Lets Talk(white flag)",
          release_date: "2022-12-01",
          release_date_precision: "day",
          total_tracks: 1,
          type: "album",
          uri: "spotify:album:6yXgCYUIy58TfKwGxFfmBL",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5xdY3QW64ss1OdFkO1NAIr",
            },
            href: "https://api.spotify.com/v1/artists/5xdY3QW64ss1OdFkO1NAIr",
            id: "5xdY3QW64ss1OdFkO1NAIr",
            name: "Mista Flip",
            type: "artist",
            uri: "spotify:artist:5xdY3QW64ss1OdFkO1NAIr",
          },
        ],
        disc_number: 1,
        duration_ms: 246551,
        explicit: true,
        external_ids: {
          isrc: "QZTB42275589",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/12fllFm70lHitkcZSGS3vT",
        },
        href: "https://api.spotify.com/v1/tracks/12fllFm70lHitkcZSGS3vT",
        id: "12fllFm70lHitkcZSGS3vT",
        is_local: false,
        is_playable: true,
        name: "Lets Talk(white flag)",
        popularity: 10,
        preview_url:
          "https://p.scdn.co/mp3-preview/3f73ac492a24919a9705dad3dcd617fb69bfa634?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 1,
        type: "track",
        uri: "spotify:track:12fllFm70lHitkcZSGS3vT",
      },
    },
    {
      added_at: "2023-03-19T03:44:13Z",
      track: {
        album: {
          album_group: "album",
          album_type: "album",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/6Q192DXotxtaysaqNPy5yR",
              },
              href: "https://api.spotify.com/v1/artists/6Q192DXotxtaysaqNPy5yR",
              id: "6Q192DXotxtaysaqNPy5yR",
              name: "Amy Winehouse",
              type: "artist",
              uri: "spotify:artist:6Q192DXotxtaysaqNPy5yR",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/0E4xv5gPjykrwBgBZzI8XG",
          },
          href: "https://api.spotify.com/v1/albums/0E4xv5gPjykrwBgBZzI8XG",
          id: "0E4xv5gPjykrwBgBZzI8XG",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b27376ffb5b5ab045d22c81235c1",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e0276ffb5b5ab045d22c81235c1",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d0000485176ffb5b5ab045d22c81235c1",
              width: 64,
            },
          ],
          is_playable: true,
          name: "Back To Black (Deluxe Edition)",
          release_date: "2006",
          release_date_precision: "year",
          total_tracks: 19,
          type: "album",
          uri: "spotify:album:0E4xv5gPjykrwBgBZzI8XG",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6Q192DXotxtaysaqNPy5yR",
            },
            href: "https://api.spotify.com/v1/artists/6Q192DXotxtaysaqNPy5yR",
            id: "6Q192DXotxtaysaqNPy5yR",
            name: "Amy Winehouse",
            type: "artist",
            uri: "spotify:artist:6Q192DXotxtaysaqNPy5yR",
          },
        ],
        disc_number: 1,
        duration_ms: 214946,
        explicit: false,
        external_ids: {
          isrc: "GBUM70603730",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/3N4DI1vuTSX1tz7fa2NQZw",
        },
        href: "https://api.spotify.com/v1/tracks/3N4DI1vuTSX1tz7fa2NQZw",
        id: "3N4DI1vuTSX1tz7fa2NQZw",
        is_local: false,
        is_playable: true,
        name: "Rehab",
        popularity: 72,
        preview_url:
          "https://p.scdn.co/mp3-preview/ffbd6236a8cf209e88ec9b16f1d6be0576af05ef?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 1,
        type: "track",
        uri: "spotify:track:3N4DI1vuTSX1tz7fa2NQZw",
      },
    },
    {
      added_at: "2023-03-19T03:43:30Z",
      track: {
        album: {
          album_group: "album",
          album_type: "album",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/6RZUqkomCmb8zCRqc9eznB",
              },
              href: "https://api.spotify.com/v1/artists/6RZUqkomCmb8zCRqc9eznB",
              id: "6RZUqkomCmb8zCRqc9eznB",
              name: "Placebo",
              type: "artist",
              uri: "spotify:artist:6RZUqkomCmb8zCRqc9eznB",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/2toHnQWm3IbSocaWGYi9J4",
          },
          href: "https://api.spotify.com/v1/albums/2toHnQWm3IbSocaWGYi9J4",
          id: "2toHnQWm3IbSocaWGYi9J4",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b2739b2e4db4b78ab31b5d55f2fc",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e029b2e4db4b78ab31b5d55f2fc",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d000048519b2e4db4b78ab31b5d55f2fc",
              width: 64,
            },
          ],
          is_playable: true,
          name: "Sleeping With Ghosts",
          release_date: "2003-03-24",
          release_date_precision: "day",
          total_tracks: 12,
          type: "album",
          uri: "spotify:album:2toHnQWm3IbSocaWGYi9J4",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6RZUqkomCmb8zCRqc9eznB",
            },
            href: "https://api.spotify.com/v1/artists/6RZUqkomCmb8zCRqc9eznB",
            id: "6RZUqkomCmb8zCRqc9eznB",
            name: "Placebo",
            type: "artist",
            uri: "spotify:artist:6RZUqkomCmb8zCRqc9eznB",
          },
        ],
        disc_number: 1,
        duration_ms: 278786,
        explicit: false,
        external_ids: {
          isrc: "GBAAA0201206",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/5Wa66vmcJPuTs9PlAdGVp7",
        },
        href: "https://api.spotify.com/v1/tracks/5Wa66vmcJPuTs9PlAdGVp7",
        id: "5Wa66vmcJPuTs9PlAdGVp7",
        is_local: false,
        is_playable: true,
        name: "Sleeping With Ghosts",
        popularity: 49,
        preview_url:
          "https://p.scdn.co/mp3-preview/453fcff7081ee60f6b2a5024874dcb72e998edfa?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 4,
        type: "track",
        uri: "spotify:track:5Wa66vmcJPuTs9PlAdGVp7",
      },
    },
    {
      added_at: "2023-03-19T03:43:27Z",
      track: {
        album: {
          album_group: "album",
          album_type: "album",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/6RZUqkomCmb8zCRqc9eznB",
              },
              href: "https://api.spotify.com/v1/artists/6RZUqkomCmb8zCRqc9eznB",
              id: "6RZUqkomCmb8zCRqc9eznB",
              name: "Placebo",
              type: "artist",
              uri: "spotify:artist:6RZUqkomCmb8zCRqc9eznB",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/2toHnQWm3IbSocaWGYi9J4",
          },
          href: "https://api.spotify.com/v1/albums/2toHnQWm3IbSocaWGYi9J4",
          id: "2toHnQWm3IbSocaWGYi9J4",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b2739b2e4db4b78ab31b5d55f2fc",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e029b2e4db4b78ab31b5d55f2fc",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d000048519b2e4db4b78ab31b5d55f2fc",
              width: 64,
            },
          ],
          is_playable: true,
          name: "Sleeping With Ghosts",
          release_date: "2003-03-24",
          release_date_precision: "day",
          total_tracks: 12,
          type: "album",
          uri: "spotify:album:2toHnQWm3IbSocaWGYi9J4",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6RZUqkomCmb8zCRqc9eznB",
            },
            href: "https://api.spotify.com/v1/artists/6RZUqkomCmb8zCRqc9eznB",
            id: "6RZUqkomCmb8zCRqc9eznB",
            name: "Placebo",
            type: "artist",
            uri: "spotify:artist:6RZUqkomCmb8zCRqc9eznB",
          },
        ],
        disc_number: 1,
        duration_ms: 315986,
        explicit: false,
        external_ids: {
          isrc: "GBAAA0201210",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/0AATuEhrQtGDevnhq9Nx2k",
        },
        href: "https://api.spotify.com/v1/tracks/0AATuEhrQtGDevnhq9Nx2k",
        id: "0AATuEhrQtGDevnhq9Nx2k",
        is_local: false,
        is_playable: true,
        name: "Special Needs",
        popularity: 60,
        preview_url:
          "https://p.scdn.co/mp3-preview/0a5e1d1a5d84cc8dce350c204d10b666ee32a38a?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 8,
        type: "track",
        uri: "spotify:track:0AATuEhrQtGDevnhq9Nx2k",
      },
    },
    {
      added_at: "2023-03-18T15:29:07Z",
      track: {
        album: {
          album_group: "album",
          album_type: "album",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/0lAWpj5szCSwM4rUMHYmrr",
              },
              href: "https://api.spotify.com/v1/artists/0lAWpj5szCSwM4rUMHYmrr",
              id: "0lAWpj5szCSwM4rUMHYmrr",
              name: "Måneskin",
              type: "artist",
              uri: "spotify:artist:0lAWpj5szCSwM4rUMHYmrr",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/2KUaR4K36tSliwAoUA1gcs",
          },
          href: "https://api.spotify.com/v1/albums/2KUaR4K36tSliwAoUA1gcs",
          id: "2KUaR4K36tSliwAoUA1gcs",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b273c1b211b5fcdef31be5f806df",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e02c1b211b5fcdef31be5f806df",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d00004851c1b211b5fcdef31be5f806df",
              width: 64,
            },
          ],
          is_playable: true,
          name: "RUSH!",
          release_date: "2023-01-20",
          release_date_precision: "day",
          total_tracks: 17,
          type: "album",
          uri: "spotify:album:2KUaR4K36tSliwAoUA1gcs",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/0lAWpj5szCSwM4rUMHYmrr",
            },
            href: "https://api.spotify.com/v1/artists/0lAWpj5szCSwM4rUMHYmrr",
            id: "0lAWpj5szCSwM4rUMHYmrr",
            name: "Måneskin",
            type: "artist",
            uri: "spotify:artist:0lAWpj5szCSwM4rUMHYmrr",
          },
        ],
        disc_number: 1,
        duration_ms: 164682,
        explicit: false,
        external_ids: {
          isrc: "ITB002200844",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/2KReCz1L5XkGIBhDncQ5VZ",
        },
        href: "https://api.spotify.com/v1/tracks/2KReCz1L5XkGIBhDncQ5VZ",
        id: "2KReCz1L5XkGIBhDncQ5VZ",
        is_local: false,
        is_playable: true,
        name: "BABY SAID",
        popularity: 78,
        preview_url:
          "https://p.scdn.co/mp3-preview/3fa0ab689c6e46a7040d84e30bd761856a95100c?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 5,
        type: "track",
        uri: "spotify:track:2KReCz1L5XkGIBhDncQ5VZ",
      },
    },
    {
      added_at: "2023-03-18T15:29:04Z",
      track: {
        album: {
          album_group: "single",
          album_type: "single",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/5grzJI0lXUO8L4yMw6BwEB",
              },
              href: "https://api.spotify.com/v1/artists/5grzJI0lXUO8L4yMw6BwEB",
              id: "5grzJI0lXUO8L4yMw6BwEB",
              name: "Irenegarry",
              type: "artist",
              uri: "spotify:artist:5grzJI0lXUO8L4yMw6BwEB",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/5EuYb5f0fGwMq44cAtgIzC",
          },
          href: "https://api.spotify.com/v1/albums/5EuYb5f0fGwMq44cAtgIzC",
          id: "5EuYb5f0fGwMq44cAtgIzC",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b2734b285647aabef6b8ca50ae3a",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e024b285647aabef6b8ca50ae3a",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d000048514b285647aabef6b8ca50ae3a",
              width: 64,
            },
          ],
          is_playable: true,
          name: "la de los Amigos",
          release_date: "2020-08-07",
          release_date_precision: "day",
          total_tracks: 1,
          type: "album",
          uri: "spotify:album:5EuYb5f0fGwMq44cAtgIzC",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5grzJI0lXUO8L4yMw6BwEB",
            },
            href: "https://api.spotify.com/v1/artists/5grzJI0lXUO8L4yMw6BwEB",
            id: "5grzJI0lXUO8L4yMw6BwEB",
            name: "Irenegarry",
            type: "artist",
            uri: "spotify:artist:5grzJI0lXUO8L4yMw6BwEB",
          },
        ],
        disc_number: 1,
        duration_ms: 72810,
        explicit: false,
        external_ids: {
          isrc: "QZK6Q2064477",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/5r4TaqZajhJnriAROpd4yj",
        },
        href: "https://api.spotify.com/v1/tracks/5r4TaqZajhJnriAROpd4yj",
        id: "5r4TaqZajhJnriAROpd4yj",
        is_local: false,
        is_playable: true,
        name: "la de los Amigos",
        popularity: 44,
        preview_url:
          "https://p.scdn.co/mp3-preview/88b5bcf4d7e9e7cef13ed697752abd5d03df069e?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 1,
        type: "track",
        uri: "spotify:track:5r4TaqZajhJnriAROpd4yj",
      },
    },
    {
      added_at: "2023-03-18T15:29:01Z",
      track: {
        album: {
          album_group: "album",
          album_type: "album",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/4whxX965DKKqYkXmk33b4E",
              },
              href: "https://api.spotify.com/v1/artists/4whxX965DKKqYkXmk33b4E",
              id: "4whxX965DKKqYkXmk33b4E",
              name: "Guano Apes",
              type: "artist",
              uri: "spotify:artist:4whxX965DKKqYkXmk33b4E",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/2YT5Jdw4Fr8YV8SoT8kl8X",
          },
          href: "https://api.spotify.com/v1/albums/2YT5Jdw4Fr8YV8SoT8kl8X",
          id: "2YT5Jdw4Fr8YV8SoT8kl8X",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b273ad2bfd69063b77cf1039d77e",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e02ad2bfd69063b77cf1039d77e",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d00004851ad2bfd69063b77cf1039d77e",
              width: 64,
            },
          ],
          is_playable: true,
          name: "Walking On A Thin Line",
          release_date: "2003",
          release_date_precision: "year",
          total_tracks: 12,
          type: "album",
          uri: "spotify:album:2YT5Jdw4Fr8YV8SoT8kl8X",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4whxX965DKKqYkXmk33b4E",
            },
            href: "https://api.spotify.com/v1/artists/4whxX965DKKqYkXmk33b4E",
            id: "4whxX965DKKqYkXmk33b4E",
            name: "Guano Apes",
            type: "artist",
            uri: "spotify:artist:4whxX965DKKqYkXmk33b4E",
          },
        ],
        disc_number: 1,
        duration_ms: 217906,
        explicit: false,
        external_ids: {
          isrc: "DEC760200346",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/3bs23FOdZ6kIRiNjpmGIF0",
        },
        href: "https://api.spotify.com/v1/tracks/3bs23FOdZ6kIRiNjpmGIF0",
        id: "3bs23FOdZ6kIRiNjpmGIF0",
        is_local: false,
        is_playable: true,
        name: "Quietly",
        popularity: 38,
        preview_url:
          "https://p.scdn.co/mp3-preview/2d74a25ce37d4f7978e26a2e4ead1a6d0a3f9261?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 6,
        type: "track",
        uri: "spotify:track:3bs23FOdZ6kIRiNjpmGIF0",
      },
    },
    {
      added_at: "2023-03-18T15:28:44Z",
      track: {
        album: {
          album_group: "single",
          album_type: "single",
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/0OQ8y7heASb1vEX5WXvjCr",
              },
              href: "https://api.spotify.com/v1/artists/0OQ8y7heASb1vEX5WXvjCr",
              id: "0OQ8y7heASb1vEX5WXvjCr",
              name: "Aaron Cole",
              type: "artist",
              uri: "spotify:artist:0OQ8y7heASb1vEX5WXvjCr",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/2uooBtdxDqd5dU7QaBTPcm",
          },
          href: "https://api.spotify.com/v1/albums/2uooBtdxDqd5dU7QaBTPcm",
          id: "2uooBtdxDqd5dU7QaBTPcm",
          images: [
            {
              height: 640,
              url: "https://i.scdn.co/image/ab67616d0000b2736e26f91015a85e4d6a5e9583",
              width: 640,
            },
            {
              height: 300,
              url: "https://i.scdn.co/image/ab67616d00001e026e26f91015a85e4d6a5e9583",
              width: 300,
            },
            {
              height: 64,
              url: "https://i.scdn.co/image/ab67616d000048516e26f91015a85e4d6a5e9583",
              width: 64,
            },
          ],
          is_playable: true,
          name: "AOTY",
          release_date: "2020-01-24",
          release_date_precision: "day",
          total_tracks: 3,
          type: "album",
          uri: "spotify:album:2uooBtdxDqd5dU7QaBTPcm",
        },
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/0OQ8y7heASb1vEX5WXvjCr",
            },
            href: "https://api.spotify.com/v1/artists/0OQ8y7heASb1vEX5WXvjCr",
            id: "0OQ8y7heASb1vEX5WXvjCr",
            name: "Aaron Cole",
            type: "artist",
            uri: "spotify:artist:0OQ8y7heASb1vEX5WXvjCr",
          },
        ],
        disc_number: 1,
        duration_ms: 240952,
        explicit: false,
        external_ids: {
          isrc: "QZE5P2062057",
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/29xxP6mLTIadUao1NHMj9x",
        },
        href: "https://api.spotify.com/v1/tracks/29xxP6mLTIadUao1NHMj9x",
        id: "29xxP6mLTIadUao1NHMj9x",
        is_local: false,
        is_playable: true,
        name: "my year",
        popularity: 42,
        preview_url:
          "https://p.scdn.co/mp3-preview/5774004206cbd2bee348a4ea5052a9c4ea3f53ff?cid=4131d07903c94ae5b560db44fc1fed20",
        track_number: 2,
        type: "track",
        uri: "spotify:track:29xxP6mLTIadUao1NHMj9x",
      },
    },
  ],
  limit: 10,
  next: "https://api.spotify.com/v1/me/tracks",
  offset: 0,
  previous: null,
  total: 653,
};

export const nextRouterMock = {
  route: "/",
  pathname: "/",
  query: { country: "US" },
  asPath: "/",
  basePath: "",
  push: (): Promise<boolean> => Promise.resolve(true),
  replace: (): Promise<boolean> => Promise.resolve(true),
  reload: (): void => {
    return;
  },
  back: (): void => {
    return;
  },
  forward: (): void => {
    return;
  },
  prefetch: (): Promise<void> => Promise.resolve(),
  beforePopState: (): void => {
    return;
  },
  events: {
    on: (): void => {
      return;
    },
    off: (): void => {
      return;
    },
    emit: (): void => {
      return;
    },
  },
  isFallback: false,
  isLocaleDomain: false,
  isPreview: false,
  isReady: true,
  isRelative: false,
  isSsr: false,
};
