import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getArtistById(
  id: string,
  context?: ServerApiContext
): Promise<SpotifyApi.SingleArtistResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/artists/${id}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.SingleArtistResponse>(res);
}
