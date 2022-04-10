import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function search(
  query: string,
  accessToken?: string
): Promise<SpotifyApi.SearchResponse> {
  const q = query.replaceAll(" ", "+");
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=album,track,artist,playlist&market=from_token&limit=10`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
        }`,
      },
    }
  );
  const data: SpotifyApi.SearchResponse = await res.json();
  return data;
}
