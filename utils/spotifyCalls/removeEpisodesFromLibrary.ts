import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function removeEpisodesFromLibrary(
  episodeIds: string[],
  context?: ServerApiContext
): Promise<boolean> {
  const ids = episodeIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/episodes?ids=${ids}`,
    method: "DELETE",
    context,
  });

  return res.ok;
}
