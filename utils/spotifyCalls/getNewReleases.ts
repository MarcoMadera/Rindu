import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getNewReleases(
  country: string,
  limit?: number,
  accessToken?: string | null,
  cookies?: string | undefined
): Promise<SpotifyApi.ListOfNewReleasesResponse | null> {
  if (!accessToken) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/browse/new-releases?country=${country}&limit=${
      limit ?? 10
    }`,
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
    const data = (await res.json()) as SpotifyApi.ListOfNewReleasesResponse;
    return data;
  }
  return null;
}
