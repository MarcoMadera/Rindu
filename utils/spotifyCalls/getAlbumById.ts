import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getAlbumById(
  id: string,
  market: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.SingleAlbumResponse | null> {
  if (!accessToken || !id) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/albums/${id}?market=${market}`,
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
    const data: SpotifyApi.SingleAlbumResponse = await res.json();
    return data;
  }
  return null;
}
