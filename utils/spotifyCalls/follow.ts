import { callSpotifyApi } from "utils/spotifyCalls";

export enum Follow_type {
  artist = "artist",
  user = "user",
}

export async function follow(
  type: Follow_type,
  id?: string,
  accessToken?: string,
  cookies?: string
): Promise<boolean> {
  if (!id) return false;

  const res = await callSpotifyApi({
    endpoint: `/me/following?type=${type}&ids=${id}`,
    method: "PUT",
    accessToken,
    cookies,
  });

  return res.ok;
}
