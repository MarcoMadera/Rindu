import { ACCESS_TOKEN_COOKIE, SITE_URL } from "../utils/constants";
import { takeCookie } from "../utils/cookies";

export async function getPlaylistsRequest(
  offset: number,
  playlistLimit: number,
  market: string,
  accessToken?: string | undefined
): Promise<Response> {
  const res = await fetch(`${SITE_URL}/api/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE),
      offset,
      playlistLimit,
      market: market ?? "US",
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
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
        }`,
      },
    }
  );
  const data = await res.json();
  return data;
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
      accessToken: takeCookie(ACCESS_TOKEN_COOKIE),
      playlist,
      tracks,
      snapshotID,
    }),
  });
  return res;
}
