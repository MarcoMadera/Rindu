import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyShows(
  offset: number,
  accessToken: string
): Promise<SpotifyApi.UsersSavedShowsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/shows?limit=50&offset=${offset}`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<SpotifyApi.UsersSavedShowsResponse>(res);
}
