import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function checkIfUserFollowAlbums(
  albumIds?: string[],
  context?: ServerApiContext
): Promise<boolean[] | null> {
  if (!albumIds) return null;

  const ids = albumIds.join();

  const res = await callSpotifyApi({
    endpoint: `/me/albums/contains?ids=${ids}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<boolean[]>(res);
}
