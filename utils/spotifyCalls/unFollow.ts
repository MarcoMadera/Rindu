import { Follow_type } from "./follow";
import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function unFollow(
  type: Follow_type,
  id?: string,
  context?: ServerApiContext
): Promise<boolean> {
  if (!id) return false;

  const res = await callSpotifyApi({
    endpoint: `/me/following?type=${type}&ids=${id}`,
    method: "DELETE",
    context,
  });

  return res.ok;
}
