import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyEpisodes(
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.UsersSavedEpisodesResponse | null> {
  const res = await callSpotifyApi({
    endpoint: "/me/episodes?limit=50&offset=0&market=from_token",
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.UsersSavedEpisodesResponse>(res);
}
