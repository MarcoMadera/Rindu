import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getCategoryPlaylists(
  category: string,
  country?: string,
  context?: ServerApiContext
): Promise<SpotifyApi.CategoryPlaylistsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/categories/${category}/playlists?country=${
      country ?? "US"
    }`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.CategoryPlaylistsResponse>(res);
}
