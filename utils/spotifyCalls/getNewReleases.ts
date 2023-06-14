import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getNewReleases(
  country: string,
  limit?: number,
  accessToken?: string | null,
  cookies?: string | undefined
): Promise<SpotifyApi.ListOfNewReleasesResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/new-releases?country=${country}&limit=${
      limit ?? 10
    }&market=from_token`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.ListOfNewReleasesResponse>(res);
}
