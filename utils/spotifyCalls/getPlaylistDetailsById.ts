import { ACCESS_TOKEN_COOKIE, SITE_URL } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getpageDetailsById(
  id: string,
  accessToken?: string,
  cookies?: string | undefined
): Promise<SpotifyApi.SinglePlaylistResponse | null> {
  const res = await fetch(`${SITE_URL}/api/playlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: accessToken ?? takeCookie(ACCESS_TOKEN_COOKIE, cookies),
      playlistId: id,
    }),
  });
  if (res.ok) {
    const data: SpotifyApi.SinglePlaylistResponse = await res.json();
    return data;
  }
  return null;
}
