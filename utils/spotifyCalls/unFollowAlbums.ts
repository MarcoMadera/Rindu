import { callSpotifyApi } from "utils/spotifyCalls";

export async function unFollowAlbums(
  ids?: string[],
  accessToken?: string
): Promise<boolean | null> {
  if (!ids) return null;

  const res = await callSpotifyApi({
    endpoint: `/me/albums?ids=${ids.join()}`,
    method: "DELETE",
    accessToken,
  });

  return res.ok;
}
