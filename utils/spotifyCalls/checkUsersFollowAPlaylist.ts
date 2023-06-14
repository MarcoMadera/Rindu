import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function checkUsersFollowAPlaylist(
  userIds?: string[],
  playlistId?: string,
  accessToken?: string
): Promise<boolean[] | null> {
  if (!playlistId || !userIds) return null;

  const ids = userIds.join();

  const res = await callSpotifyApi({
    endpoint: `/playlists/${playlistId}/followers/contains?ids=${ids}`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<boolean[]>(res);
}
