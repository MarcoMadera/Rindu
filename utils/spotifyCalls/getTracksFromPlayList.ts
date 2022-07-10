import { ITrack } from "types/spotify";
import { ACCESS_TOKEN_COOKIE, SITE_URL } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getTracksFromPlayList(
  playlistId: string,
  market: string,
  accessToken?: string,
  cookies?: string | undefined
): Promise<ITrack[] | null> {
  const res = await fetch(
    `${SITE_URL}/api/playlists?market=${market}&additional_types=track,episode`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken ?? takeCookie(ACCESS_TOKEN_COOKIE, cookies),
        playlistId,
      }),
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return null;
}
