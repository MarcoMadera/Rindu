import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function checkIfUserFollowAlbums(
  albumIds?: string[],
  accessToken?: string
): Promise<boolean[] | null> {
  if (!albumIds) {
    return null;
  }
  const ids = albumIds.join();
  const res = await fetch(
    `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
        }`,
      },
    }
  );
  if (res.ok) {
    const data: boolean[] = await res.json();
    return data;
  }
  return null;
}
