import { callSpotifyApi } from "utils/spotifyCalls";

export async function followAlbums(
  ids?: string[] | string,
  accessToken?: string
): Promise<boolean | null> {
  if (!ids) return null;

  const res = await callSpotifyApi({
    endpoint: `/me/albums?ids=${Array.isArray(ids) ? ids.join() : ids}`,
    method: "PUT",
    accessToken,
  });

  return res.ok;
}
