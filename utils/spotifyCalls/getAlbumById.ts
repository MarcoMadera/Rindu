import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getAlbumById(
  id: string,
  market: string,
  context?: ServerApiContext
): Promise<SpotifyApi.SingleAlbumResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/albums/${id}?market=${market}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.SingleAlbumResponse>(res);
}
