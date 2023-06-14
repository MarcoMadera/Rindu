import { callSpotifyApi } from "utils/spotifyCalls";

export async function transferPlayback(
  device_ids: string[],
  options:
    | { play?: boolean; accessToken?: string; cookies?: string }
    | undefined
): Promise<boolean> {
  const { accessToken, cookies, play = true } = options ?? {};
  const res = await callSpotifyApi({
    endpoint: "/me/player",
    method: "PUT",
    accessToken,
    cookies,
    body: JSON.stringify({
      device_ids,
      play,
    }),
  });

  return res.ok;
}
