import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function saveShowsToLibrary(
  showIds: string[] | string,
  context?: ServerApiContext
): Promise<boolean> {
  const ids = Array.isArray(showIds) ? showIds.join() : showIds;
  const res = await callSpotifyApi({
    endpoint: `/me/shows?ids=${ids}`,
    method: "PUT",
    context,
  });

  return res.ok;
}
