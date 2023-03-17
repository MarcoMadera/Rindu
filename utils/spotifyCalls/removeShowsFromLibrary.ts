import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function removeShowsFromLibrary(
  showIds: string[],
  accessToken?: string
): Promise<boolean> {
  const ids = showIds.join();
  const res = await fetch(`https://api.spotify.com/v1/me/shows?ids=${ids}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
      }`,
    },
  });
  return res.ok;
}
