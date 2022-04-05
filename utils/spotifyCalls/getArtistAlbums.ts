import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export enum Include_groups {
  single = "single",
  appears_on = "appears_on",
  both = "single%2Cappears_on",
}

export async function getArtistAlbums(
  id: string,
  market: string,
  include_groups: Include_groups,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.ArtistsAlbumsResponse | null> {
  if (!accessToken || !id) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/albums?include_groups=${include_groups}&market=${market}`,
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
    const data: SpotifyApi.ArtistsAlbumsResponse = await res.json();
    return data;
  }
  return null;
}
