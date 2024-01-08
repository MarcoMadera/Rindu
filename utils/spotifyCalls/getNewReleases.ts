import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getNewReleases(
  country: string,
  limit?: number,
  context?: ServerApiContext
): Promise<SpotifyApi.ListOfNewReleasesResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/new-releases?country=${country}&limit=${
      limit ?? 10
    }&market=from_token`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ListOfNewReleasesResponse>(res);
}
