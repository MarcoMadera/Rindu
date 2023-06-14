import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getUserById(
  id: string,
  accessToken?: string
): Promise<SpotifyApi.UserObjectPublic | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/users/${id}`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<SpotifyApi.UserObjectPublic>(res);
}
