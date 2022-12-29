import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function followAlbums(
  ids?: string[] | string,
  accessToken?: string
): Promise<boolean | undefined> {
  if (!ids) {
    return;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/albums?ids=${
      Array.isArray(ids) ? ids.join() : ids
    }`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  return res.ok;
}
