import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getPlaylistsFromUser(
  userId: string,
  context?: ServerApiContext
): Promise<SpotifyApi.ListOfUsersPlaylistsResponse | null> {
  if (!userId) return null;

  const res = await callSpotifyApi({
    endpoint: `/users/${userId}/playlists`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ListOfUsersPlaylistsResponse>(res);
}
