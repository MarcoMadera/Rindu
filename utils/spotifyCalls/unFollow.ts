import { Follow_type } from "./follow";
import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function unFollow(
  type: Follow_type,
  id?: string,
  accessToken?: string,
  cookies?: string
): Promise<boolean> {
  if (!id) {
    return false;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}&ids=${id}`,
    {
      method: "DELETE",
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
