import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMe(
  accessToken?: string | null,
  cookies?: string
): Promise<SpotifyApi.CurrentUsersProfileResponse | null> {
  const res = await callSpotifyApi({
    endpoint: "/me",
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.CurrentUsersProfileResponse>(res);
}
