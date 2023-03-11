import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export default async function getMe(
  accessToken?: string | null,
  cookies?: string
): Promise<SpotifyApi.CurrentUsersProfileResponse | null> {
  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken
          ? accessToken
          : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
      }`,
    },
  });

  if (res.ok) {
    const data = (await res.json()) as SpotifyApi.CurrentUsersProfileResponse;
    return data;
  }
  return null;
}
