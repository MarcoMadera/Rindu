import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function saveEpisodesToLibrary(
  episodeIds: string[],
  context?: ServerApiContext
): Promise<boolean> {
  const ids = episodeIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/episodes?ids=${ids}`,
    method: "PUT",
    context,
  });

  return res.ok;
}
