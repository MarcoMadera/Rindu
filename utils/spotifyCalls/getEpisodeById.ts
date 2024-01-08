import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getEpisodeById(
  id: string,
  market: string,
  context?: ServerApiContext
): Promise<SpotifyApi.SingleEpisodeResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/episodes/${id}?market=${market}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.SingleEpisodeResponse>(res);
}
