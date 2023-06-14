import { callSpotifyApi } from "utils/spotifyCalls";

export async function saveShowsToLibrary(
  showIds: string[] | string,
  accessToken?: string
): Promise<boolean> {
  const ids = Array.isArray(showIds) ? showIds.join() : showIds;
  const res = await callSpotifyApi({
    endpoint: `/me/shows?ids=${ids}`,
    method: "PUT",
    accessToken,
  });

  return res.ok;
}
