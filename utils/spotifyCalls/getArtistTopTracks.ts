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
    endpoint: `/artists/${id}/top-tracks?market=${market}&fields=items(added_at,is_local,track(id,album(name,images,id),artists(name,id,type,uri),name,duration_ms,uri,explicit,is_playable,preview_url,type)),total`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ArtistsTopTracksResponse>(res);
}
