import { callSpotifyApi } from "utils/spotifyCalls";

export async function removeShowsFromLibrary(
  showIds: string[],
  accessToken?: string
): Promise<boolean> {
  const ids = showIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/shows?ids=${ids}`,
    method: "DELETE",
    accessToken,
  });

  return res.ok;
}
