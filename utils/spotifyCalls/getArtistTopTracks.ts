import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getArtistTopTracks(
  id: string,
  market: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.ArtistsTopTracksResponse | null> {
  if (!accessToken || !id) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE, cookies)
        }`,
      },
    }
  );
  if (res.ok) {
    const data: SpotifyApi.ArtistsTopTracksResponse = await res.json();
    return data;
  }
  return null;
}
