import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function getArtistTopTracks(
  id: string,
  market: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.ArtistsTopTracksResponse | null> {
  if (!id) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}&fields=items(added_at,is_local,track(id,album(name,images,id),artists(name,id,type,uri),name,duration_ms,uri,explicit,is_playable,preview_url,type)),total`,
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
    const data = (await res.json()) as SpotifyApi.ArtistsTopTracksResponse;
    return data;
  }
  return null;
}
