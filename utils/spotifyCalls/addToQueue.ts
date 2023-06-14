import { callSpotifyApi } from "utils/spotifyCalls";

export async function addToQueue(
  uri: string,
  device_id: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.AddToQueueResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/player/queue?uri=${uri}&device_id=${device_id}`,
    method: "POST",
    accessToken,
    cookies,
  });
  return res.ok;
}
