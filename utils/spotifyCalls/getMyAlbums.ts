import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyAlbums(
  offset: number,
  context?: ServerApiContext
): Promise<SpotifyApi.UsersSavedAlbumsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/albums?limit=50&offset=${offset}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.UsersSavedAlbumsResponse>(res);
}
