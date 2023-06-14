import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getPlaylistsFromUser(
  userId: string,
  accessToken?: string
): Promise<SpotifyApi.ListOfUsersPlaylistsResponse | null> {
  if (!userId) return null;

  const res = await callSpotifyApi({
    endpoint: `/users/${userId}/playlists`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<SpotifyApi.ListOfUsersPlaylistsResponse>(res);
}
