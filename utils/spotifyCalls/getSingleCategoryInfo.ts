import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getSingleCategoryInfo(
  category: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.SingleCategoryResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/categories/${category}`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.SingleCategoryResponse>(res);
}
