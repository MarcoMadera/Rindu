import { Follow_type } from "./follow";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function unFollow(
  type: Follow_type,
  id?: string,
  accessToken?: string,
  cookies?: string
): Promise<boolean> {
  if (!id) return false;

  const res = await callSpotifyApi({
    endpoint: `/me/following?type=${type}&ids=${id}`,
    method: "DELETE",
    accessToken,
    cookies,
  });

  return res.ok;
}
