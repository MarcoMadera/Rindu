import { ACCESSTOKENCOOKIE, SITE_URL } from "../utils/constants";
import { takeCookie } from "../utils/cookies";

export async function getPlaylistsRequest(
  offset: number,
  playlistLimit: number,
  accessToken?: string | undefined
): Promise<Response> {
  const res = await fetch(`${SITE_URL}/api/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE),
      offset,
      playlistLimit,
    }),
  });
  return res;
}

export async function getTracksFromPlaylist(
  playlistId: string,
  offset = 0,
  accessToken?: string | undefined
): Promise<Response> {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=50`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
        }`,
      },
    }
  );
  return res;
}

export async function getTracksFromPlayListRequest(
  playlistId: string,
  cookies?: string | undefined
): Promise<Response> {
  const res = await fetch(`${SITE_URL}/api/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: takeCookie(ACCESSTOKENCOOKIE, cookies),
      playlistId,
    }),
  });
  return res;
}
export async function getSinglePlayListRequest(
  playlistId: string,
  cookies?: string | undefined
): Promise<Response> {
  const res = await fetch(`${SITE_URL}/api/playlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: takeCookie(ACCESSTOKENCOOKIE, cookies),
      playlistId,
    }),
  });
  return res;
}

export async function removeTracksRequest(
  playlist: string | undefined,
  tracks: number[],
  snapshotID: string | undefined
): Promise<Response> {
  const res = await fetch(`${SITE_URL}/api/removetracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: takeCookie(ACCESSTOKENCOOKIE),
      playlist,
      tracks,
      snapshotID,
    }),
  });
  return res;
}

export async function getAuthorizationByCode(code: string): Promise<Response> {
  const res = await fetch(`${SITE_URL}/api/spotify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  return res;
}
export async function refreshAccessTokenRequest(
  refreshToken: string
): Promise<Response> {
  const res = await fetch(`${SITE_URL}/api/spotify-refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  return res;
}
