import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMe(
  context?: ServerApiContext
): Promise<SpotifyApi.CurrentUsersProfileResponse | null> {
  const res = await callSpotifyApi({
    endpoint: "/me",
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.CurrentUsersProfileResponse>(res);
}
