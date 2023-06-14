import { callSpotifyApi } from "utils/spotifyCalls";

export async function removeTracksFromLibrary(
  ids: string[],
  accessToken?: string
): Promise<boolean> {
  const res = await callSpotifyApi({
    endpoint: "/me/tracks",
    method: "DELETE",
    accessToken,
    body: JSON.stringify({ ids }),
  });

  return res.ok;
}
