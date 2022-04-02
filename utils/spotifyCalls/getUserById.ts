import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getUserById(id: string, accessToken?: string) {
  if (!accessToken || !id) {
    return null;
  }
  const res = await fetch(`https://api.spotify.com/v1/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
      }`,
    },
  });
  if (res.ok) {
    const data: SpotifyApi.UserObjectPublic = await res.json();
    return data;
  }
  return null;
}
