import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getUserById(
  id: string,
  context?: ServerApiContext
): Promise<SpotifyApi.UserObjectPublic | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/users/${id}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.UserObjectPublic>(res);
}
