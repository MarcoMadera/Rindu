import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function checkIfUserFollowShows(
  showIds?: string[],
  context?: ServerApiContext
): Promise<boolean[] | null> {
  if (!showIds) return null;
  const ids = showIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/shows/contains?ids=${ids}`,
    method: "GET",
    context,
  });
  return handleJsonResponse<boolean[]>(res);
}
