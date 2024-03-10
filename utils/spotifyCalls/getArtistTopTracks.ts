import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getArtistTopTracks(
  id: string,
  market: string,
  context?: ServerApiContext
): Promise<SpotifyApi.ArtistsTopTracksResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/artists/${id}/top-tracks?market=${market}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ArtistsTopTracksResponse>(res);
}
