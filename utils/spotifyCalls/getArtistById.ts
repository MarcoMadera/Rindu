import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export default async function getArtistById(
  id: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.SingleArtistResponse | null> {
  if (!id) {
    return null;
  }
  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
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
    const data = (await res.json()) as SpotifyApi.SingleArtistResponse;
    return data;
  }
  return null;
}
