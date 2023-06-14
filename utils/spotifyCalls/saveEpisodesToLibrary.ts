import { callSpotifyApi } from "utils/spotifyCalls";

export async function saveEpisodesToLibrary(
  episodeIds: string[],
  accessToken?: string
): Promise<boolean> {
  const ids = episodeIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/episodes?ids=${ids}`,
    method: "PUT",
    accessToken,
  });

  return res.ok;
}
