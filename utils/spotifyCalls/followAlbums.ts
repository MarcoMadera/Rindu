import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function followAlbums(
  ids?: string[] | string,
  context?: ServerApiContext
): Promise<boolean | null> {
  if (!ids) return null;

  const res = await callSpotifyApi({
    endpoint: `/me/albums?ids=${Array.isArray(ids) ? ids.join() : ids}`,
    method: "PUT",
    context,
  });

  return res.ok;
}
