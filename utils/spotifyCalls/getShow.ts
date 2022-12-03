import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getShow(
  id: string,
  accessToken: string | undefined
): Promise<SpotifyApi.ShowObject | null> {
  const res = await fetch(`https://api.spotify.com/v1/shows/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
      }`,
    },
  });
  if (res.ok) {
    const data = (await res.json()) as SpotifyApi.ShowObject;
    return data;
  }
  return null;
}
