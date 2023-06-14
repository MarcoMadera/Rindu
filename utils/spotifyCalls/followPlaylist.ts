import { callSpotifyApi } from "utils/spotifyCalls";

export async function followPlaylist(
  id?: string,
  accessToken?: string
): Promise<boolean | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/playlists/${id}/followers`,
    method: "PUT",
    accessToken,
  });

  return res.ok;
}
