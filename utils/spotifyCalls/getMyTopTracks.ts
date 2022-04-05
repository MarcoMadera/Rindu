import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getMyTopTracks(
  accessToken?: string | null,
  limit?: number,
  time_range?: "medium_term" | "short_term" | "long_term",
  cookies?: string | undefined
): Promise<SpotifyApi.UsersTopTracksResponse | null> {
  if (!accessToken) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${
      time_range ?? "short_term"
    }&limit=${limit ?? 10}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ?? takeCookie(ACCESS_TOKEN_COOKIE, cookies)
        }`,
      },
    }
  );

  if (res.ok) {
    const data: SpotifyApi.UsersTopTracksResponse = await res.json();
    return data;
  }
  return null;
}
