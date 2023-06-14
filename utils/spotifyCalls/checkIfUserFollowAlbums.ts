import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function checkIfUserFollowAlbums(
  albumIds?: string[],
  accessToken?: string
): Promise<boolean[] | null> {
  if (!albumIds) return null;

  const ids = albumIds.join();

  const res = await callSpotifyApi({
    endpoint: `/me/albums/contains?ids=${ids}`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<boolean[]>(res);
}
