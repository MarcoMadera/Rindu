import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function saveShowsToLibrary(
  showIds: string[] | string,
  accessToken?: string
): Promise<boolean> {
  const ids = Array.isArray(showIds) ? showIds.join() : showIds;
  const res = await fetch(`https://api.spotify.com/v1/me/shows?ids=${ids}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
      }`,
    },
  });
  return res.ok;
}
