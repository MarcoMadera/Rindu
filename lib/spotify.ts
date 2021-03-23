import SpotifyWebAPI from "spotify-web-api-node";
import {
  AuthorizationResponse,
  RefreshResponse,
  SpotifyUserResponse,
  RemoveTracksResponse,
  UserPlaylistsResponse,
  AllTracksFromAPlaylistResponse,
} from "./types";

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URL = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const spotifyAPI = new SpotifyWebAPI({
  redirectUri: SPOTIFY_REDIRECT_URL,
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
});

export async function getSpotifyAuthorization(
  code: string
): Promise<AuthorizationResponse> {
  const data = await spotifyAPI.authorizationCodeGrant(code);
  return {
    accessToken: data.body.access_token,
    refreshToken: data.body.refresh_token,
    expiresIn: data.body.expires_in,
  };
}

export async function getRefreshAccessToken(
  refreshToken: string
): Promise<RefreshResponse> {
  spotifyAPI.setRefreshToken(refreshToken);
  const data = await spotifyAPI.refreshAccessToken();
  return {
    accessToken: data.body.access_token,
    expiresIn: data.body.expires_in,
    refreshToken: data.body.refresh_token,
  };
}

export async function getSpotifyUser(
  accessToken: string
): Promise<SpotifyUserResponse> {
  spotifyAPI.setAccessToken(accessToken);
  const data = await spotifyAPI.getMe();
  return {
    name: data.body.display_name,
    image: data.body.images?.[0].url,
    href: data.body.external_urls.spotify,
    id: data.body.id,
  };
}

export async function getUserPlaylists(
  accessToken: string,
  offset = 0,
  limit = 10
): Promise<UserPlaylistsResponse> {
  spotifyAPI.setAccessToken(accessToken);
  const data = await spotifyAPI.getUserPlaylists({ offset, limit });
  return {
    items: data.body.items.map(
      ({
        images,
        name,
        public: isPublic,
        tracks,
        description,
        id,
        snapshot_id,
        external_urls,
        owner,
      }) => {
        return {
          images: images.map(({ url }) => ({
            url,
          })),
          name,
          isPublic,
          tracks: tracks.total,
          description,
          id,
          snapshot_id,
          href: external_urls.spotify,
          owner: owner.id,
        };
      }
    ),
    total: data.body.total,
  };
}
export const getAllTracksFromPlaylist = async (
  accessToken: string,
  playlist: string
): Promise<AllTracksFromAPlaylistResponse> => {
  try {
    spotifyAPI.setAccessToken(accessToken);
    let tracks = [];
    const data = await spotifyAPI.getPlaylistTracks(playlist);
    const { body } = data;
    tracks = body.items;
    if (body.total > 100)
      for (let i = 1; i < Math.ceil(body.total / 100); i++) {
        const add = await spotifyAPI.getPlaylistTracks(playlist, {
          offset: 100 * i,
        });
        tracks = [...tracks, ...add.body.items];
      }
    return {
      tracks: tracks.map(({ track }, i) => {
        return {
          name: track.name || undefined,
          images: track.album.images || undefined,
          uri: track.uri || undefined,
          href: track.external_urls.spotify || undefined,
          artists:
            track.artists.map((_artist) => _artist.name).join(", ") ||
            undefined,
          id: track.id || undefined,
          explicit: track.explicit || undefined,
          duration: track.duration_ms || undefined,
          corruptedTrack: false,
          position: i,
        };
      }),
    };
  } catch (err) {
    throw new Error(`getAllTracksFromPlaylist error: ${err}`);
  }
};

export async function removeTracksFromPlaylist(
  accessToken: string,
  playlist: string,
  tracks: Array<number>,
  snapshotID: string
): Promise<RemoveTracksResponse> {
  try {
    spotifyAPI.setAccessToken(accessToken);
    const data = await spotifyAPI.removeTracksFromPlaylistByPosition(
      playlist,
      tracks,
      snapshotID
    );
    return data.body.snapshot_id;
  } catch (err) {
    throw new Error(`removeTracksFromPlaylist error: ${err}`);
  }
}
