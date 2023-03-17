import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function checkIfUserFollowShows(
  showIds?: string[],
  accessToken?: string
): Promise<boolean[] | null> {
  if (!showIds) {
    return null;
  }
  const ids = showIds.join();
  const res = await fetch(
    `https://api.spotify.com/v1/me/shows/contains?ids=${ids}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  if (res.ok) {
    const data = (await res.json()) as boolean[];
    return data;
  }
  return null;
}
