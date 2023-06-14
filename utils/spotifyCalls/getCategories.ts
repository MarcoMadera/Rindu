import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getCategories(
  country: string,
  limit?: number,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/categories?country=${country}&limit=${
      limit ?? 5
    }&market=from_token`,
    method: "GET",
    accessToken,
    cookies,
  });

  const data = await handleJsonResponse<SpotifyApi.MultipleCategoriesResponse>(
    res
  );

  if (data) return data.categories;

  return null;
}
