import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export enum Follow_type {
  Artist = "artist",
  User = "user",
}

export async function follow(
  type: Follow_type,
  id?: string,
  context?: ServerApiContext
): Promise<boolean> {
  if (!id) return false;

  const res = await callSpotifyApi({
    endpoint: `/me/following?type=${type}&ids=${id}`,
    method: "PUT",
    context,
  });

  return res.ok;
}
