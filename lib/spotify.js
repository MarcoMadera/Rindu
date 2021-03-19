import SpotifyWebAPI from "spotify-web-api-node";

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URL = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const spotifyAPI = new SpotifyWebAPI({
  redirectUri: SPOTIFY_REDIRECT_URL,
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
});

export async function getSpotifyAuthorization(code) {
  try {
    const data = await spotifyAPI.authorizationCodeGrant(code);
    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    };
  } catch (err) {
    throw new Error(`getSpotifyAuthorization error: ${err}`);
  }
}

export async function getRefreshAccessToken(refreshToken) {
  try {
    spotifyAPI.setRefreshToken(refreshToken);
    const data = await spotifyAPI.refreshAccessToken();
    return {
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in,
    };
  } catch (err) {
    throw new Error(`getRefreshAccessToken error: ${err}`);
  }
}

export async function getUserPlaylists(accessToken, offset = 0, limit = 20) {
  try {
    spotifyAPI.setAccessToken(accessToken);
    const data = await spotifyAPI.getUserPlaylists({ offset, limit });
    return data.body;
  } catch (err) {
    throw new Error(`getUserPlaylists error: ${err}`);
  }
}

export const getAllTracksFromPlaylist = async (accessToken, playlist) => {
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
    return tracks;
  } catch (err) {
    throw new Error(`getAllTracksFromPlaylist error: ${err}`);
  }
};

export async function removeTracksFromPlaylist(
  accessToken,
  playlist,
  tracks,
  snapshotID
) {
  try {
    spotifyAPI.setAccessToken(accessToken);
    const data = await spotifyAPI.removeTracksFromPlaylistByPosition(
      playlist,
      tracks,
      snapshotID
    );
    return data.body;
  } catch (err) {
    throw new Error(`removeTracksFromPlaylist error: ${err}`);
  }
}
