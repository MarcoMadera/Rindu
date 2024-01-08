import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getShow(
  id: string,
  context?: ServerApiContext
): Promise<SpotifyApi.ShowObject | null> {
  const res = await callSpotifyApi({
    endpoint: `/shows/${id}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ShowObject>(res);
}
