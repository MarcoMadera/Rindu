import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getUserPlaylists(
  accessToken: string,
  offset = 0,
  limit = 50
): Promise<SpotifyApi.ListOfCurrentUsersPlaylistsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/playlists?limit=${limit}&offset=${offset}`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
    res
  );
}
