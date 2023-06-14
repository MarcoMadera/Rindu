import { callSpotifyApi } from "utils/spotifyCalls";

export async function removeEpisodesFromLibrary(
  episodeIds: string[],
  accessToken?: string
): Promise<boolean> {
  const ids = episodeIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/episodes?ids=${ids}`,
    method: "DELETE",
    accessToken,
  });

  return res.ok;
}
