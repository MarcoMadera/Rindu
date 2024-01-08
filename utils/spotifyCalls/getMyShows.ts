import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyShows(
  offset: number,
  context?: ServerApiContext
): Promise<SpotifyApi.UsersSavedShowsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/shows?limit=50&offset=${offset}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.UsersSavedShowsResponse>(res);
}
