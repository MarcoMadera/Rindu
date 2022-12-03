import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getMyLikedSongs(
  market: string,
  accessToken?: string,
  cookies?: string | undefined
): Promise<SpotifyApi.PlaylistTrackResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks?limit=50&offset=0&market=${market}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ?? (takeCookie(ACCESS_TOKEN_COOKIE, cookies) || "")
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
