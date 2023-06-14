import { callSpotifyApi } from "utils/spotifyCalls";

export async function saveTracksToLibrary(
  tracksIds: string[],
  accessToken?: string
): Promise<boolean> {
  const ids = tracksIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/tracks?ids=${ids}`,
    method: "PUT",
    accessToken,
  });

  return res.ok;
}
