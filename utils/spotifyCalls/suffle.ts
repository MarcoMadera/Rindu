import { callSpotifyApi } from "utils/spotifyCalls";

export async function suffle(
  state: boolean,
  deviceId: string,
  accessToken?: string
): Promise<boolean> {
  const res = await callSpotifyApi({
    endpoint: `/me/player/shuffle?state=${state.toString()}&deviceId=${deviceId}`,
    method: "PUT",
    accessToken,
  });

  return res.ok;
}
