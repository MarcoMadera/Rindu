import { Follow_type } from "./follow";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function checkIfUserFollowArtistUser(
  type: Follow_type,
  id?: string,
  accessToken?: string,
  cookies?: string
): Promise<boolean> {
  if (!id) return false;

  const res = await callSpotifyApi({
    endpoint: `/me/following/contains?type=${type}&ids=${id}`,
    method: "GET",
    accessToken,
    cookies,
  });
  const data = await handleJsonResponse<boolean[]>(res);

  if (data) {
    return data?.[0] ?? false;
  }

  return false;
}
