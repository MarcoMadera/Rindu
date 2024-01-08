import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function unFollowAlbums(
  ids?: string[],
  context?: ServerApiContext
): Promise<boolean | null> {
  if (!ids) return null;

  const res = await callSpotifyApi({
    endpoint: `/me/albums?ids=${ids.join()}`,
    method: "DELETE",
    context,
  });

  return res.ok;
}
