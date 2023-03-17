import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function checkTracksInLibrary(
  ids: string[],
  accessToken?: string,
  cookies?: string
): Promise<boolean[] | null> {
  if (ids?.length === 0) return null;
  const stringIds = ids?.join(",");
  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${stringIds}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ?? takeCookie(ACCESS_TOKEN_COOKIE, cookies) ?? ""
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
