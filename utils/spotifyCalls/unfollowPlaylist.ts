import { callSpotifyApi } from "utils/spotifyCalls";

export async function unfollowPlaylist(
  id?: string,
  accessToken?: string
): Promise<boolean | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/playlists/${id}/followers`,
    method: "DELETE",
    accessToken,
  });

  return res.ok;
}
