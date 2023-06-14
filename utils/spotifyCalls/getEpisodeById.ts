import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getEpisodeById(
  id: string,
  market: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.SingleEpisodeResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/episodes/${id}?market=${market}`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.SingleEpisodeResponse>(res);
}
