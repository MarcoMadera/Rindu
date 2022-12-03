import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export enum Follow_type {
  artist = "artist",
  user = "user",
}

export async function follow(
  type: Follow_type,
  id?: string,
  accessToken?: string,
  cookies?: string
): Promise<boolean> {
  if (!accessToken || !id) {
    return false;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}&ids=${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken
            ? accessToken
            : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
        }`,
      },
    }
  );
  if (res.ok) {
    return true;
  }
  return false;
}
