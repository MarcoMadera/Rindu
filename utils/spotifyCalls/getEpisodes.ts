import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getEpisodes(accessToken?: string, cookies?: string) {
  const res = await fetch(
    "https://api.spotify.com/v1/me/episodes?limit=1&offset=0&market=from_token",
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE, cookies)
        }`,
      },
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return null;
}
