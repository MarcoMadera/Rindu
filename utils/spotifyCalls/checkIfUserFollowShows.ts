import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function checkIfUserFollowShows(
  showIds?: string[],
  accessToken?: string
): Promise<boolean[] | null> {
  if (!showIds) return null;
  const ids = showIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/shows/contains?ids=${ids}`,
    method: "GET",
    accessToken,
  });
  return handleJsonResponse<boolean[]>(res);
}
