import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getFeaturedPlaylists(
  country: string,
  limit: number,
  context?: ServerApiContext
): Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/featured-playlists?country=${country}&limit=${limit}&market=from_token`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ListOfFeaturedPlaylistsResponse>(res);
}
