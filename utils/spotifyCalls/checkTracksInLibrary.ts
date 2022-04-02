import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function checkTracksInLibrary(
  ids: string[],
  accessToken?: string,
  cookies?: string
): Promise<boolean[] | null> {
  const stringIds = ids.join(",");
  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${stringIds}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ?? takeCookie(ACCESS_TOKEN_COOKIE, cookies)
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
