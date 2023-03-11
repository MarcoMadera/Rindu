import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export default async function getEpisodeById(
  id: string,
  market: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.SingleEpisodeResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/episodes/${id}?market=${market}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${
          accessToken
            ? accessToken
            : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
        }`,
      },
    }
  );
  if (res.ok) {
    const data: SpotifyApi.SingleEpisodeResponse =
      (await res.json()) as SpotifyApi.SingleEpisodeResponse;
    return data;
  }
  return null;
}
