import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getRecommendations(
  seed_tracks: string[],
  accessToken?: string | null
): Promise<SpotifyApi.TrackObjectFull[] | null> {
  if (!accessToken) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
        }`,
      },
    }
  );
  if (res.ok) {
    const data: SpotifyApi.RecommendationsObject = await res.json();
    return data?.tracks as SpotifyApi.TrackObjectFull[];
  }
  return null;
}
