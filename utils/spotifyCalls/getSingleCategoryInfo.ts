import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getSingleCategoryInfo(
  category: string,
  context?: ServerApiContext
): Promise<SpotifyApi.SingleCategoryResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/categories/${category}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.SingleCategoryResponse>(res);
}
