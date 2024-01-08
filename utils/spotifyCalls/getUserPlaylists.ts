import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getUserPlaylists(
  offset = 0,
  limit = 50,
  context?: ServerApiContext
): Promise<SpotifyApi.ListOfCurrentUsersPlaylistsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/playlists?limit=${limit}&offset=${offset}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
    res
  );
}
