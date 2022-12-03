import { ACCESS_TOKEN_COOKIE } from "./constants";
import { takeCookie } from "./cookies";

export async function getTracksFromLibrary(
  offSet: number,
  accessToken?: string
): Promise<SpotifyApi.PlaylistTrackResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks?offset=${offSet}&limit=50`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
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
