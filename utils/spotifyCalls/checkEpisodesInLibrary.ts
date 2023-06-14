import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function checkEpisodesInLibrary(
  ids: string[],
  accessToken?: string,
  cookies?: string
): Promise<boolean[] | null> {
  if (ids?.length === 0) return null;
  const stringIds = ids?.join(",");

  const res = await callSpotifyApi({
    endpoint: `/me/episodes/contains?ids=${stringIds}`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<boolean[]>(res);
}
