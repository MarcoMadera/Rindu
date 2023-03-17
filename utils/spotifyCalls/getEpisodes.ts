import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function getMyEpisodes(
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.UsersSavedEpisodesResponse | null> {
  const res = await fetch(
    "https://api.spotify.com/v1/me/episodes?limit=50&offset=0&market=from_token",
    {
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
    const data = (await res.json()) as SpotifyApi.UsersSavedEpisodesResponse;
    return data;
  }
  return null;
}
