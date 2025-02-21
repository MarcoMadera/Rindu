import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getAlbumTracks(
  id: string,
  offset = 0,
  context?: ServerApiContext | undefined
): Promise<SpotifyApi.AlbumTracksResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/albums/${id}/tracks?offset=${offset}&limit=50`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.AlbumTracksResponse>(res);
}
