import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function getTracksFromPlaylist(
  playlistId: string,
  offset = 0,
  accessToken?: string | undefined,
  cookies?: string | undefined
): Promise<SpotifyApi.PlaylistTrackResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=50&fields=items(added_at,is_local,track(id,album(name,images,id),artists(name,id,type,uri),name,duration_ms,uri,explicit,is_playable,preview_url,type)),total`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken
            ? accessToken
            : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
        }`,
      },
    }
  );
  if (res.ok) {
    const data = (await res.json()) as SpotifyApi.PlaylistTrackResponse;
    return data;
  }
  return null;
}
