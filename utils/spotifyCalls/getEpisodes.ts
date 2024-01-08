import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyEpisodes(
  context?: ServerApiContext
): Promise<SpotifyApi.UsersSavedEpisodesResponse | null> {
  const res = await callSpotifyApi({
    endpoint: "/me/episodes?limit=50&offset=0&market=from_token",
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.UsersSavedEpisodesResponse>(res);
}
