import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function removeShowsFromLibrary(
  showIds: string[],
  context?: ServerApiContext
): Promise<boolean> {
  const ids = showIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/shows?ids=${ids}`,
    method: "DELETE",
    context,
  });

  return res.ok;
}
