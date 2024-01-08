import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getRelatedArtists(
  id: string,
  context?: ServerApiContext
): Promise<SpotifyApi.ArtistsRelatedArtistsResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/artists/${id}/related-artists`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ArtistsRelatedArtistsResponse>(res);
}
