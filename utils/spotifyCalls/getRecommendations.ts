import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

interface IgetRecommendations {
  seed_tracks: string[];
  limit?: number;
  market?: string;
  accessToken?: string | null;
}

export async function getRecommendations({
  seed_tracks,
  limit,
  market,
  accessToken,
}: IgetRecommendations): Promise<SpotifyApi.TrackObjectFull[] | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks.join()}&market=${
      market || "from_token"
    }&limit=${limit ?? 20}`,
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
    const data = (await res.json()) as {
      tracks: SpotifyApi.TrackObjectFull[];
    };
    return data?.tracks;
  }
  return null;
}
