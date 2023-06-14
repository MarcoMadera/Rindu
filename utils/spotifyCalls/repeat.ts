import { callSpotifyApi } from "utils/spotifyCalls";

export async function repeat(
  state: "track" | "context" | "off",
  deviceId: string,
  accessToken?: string
): Promise<boolean> {
  const res = await callSpotifyApi({
    endpoint: `/player/repeat?state=${state}&deviceId=${deviceId}`,
    method: "PUT",
    accessToken,
  });

  return res.ok;
}
