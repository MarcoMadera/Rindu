import { NextApiResponse } from "next";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants";
import { takeCookie } from "./cookies";
import { serverRedirect } from "./serverRedirect";
import { getMe } from "./spotifyCalls/getMe";
import { refreshAccessToken } from "./spotifyCalls/refreshAccessToken";

export async function getAuth(
  res: NextApiResponse,
  cookies: string
): Promise<{ user: SpotifyApi.UserObjectPrivate; accessToken: string } | null> {
  const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE, cookies);
  const accessTokenFromCookie = takeCookie(ACCESS_TOKEN_COOKIE, cookies);
  const user = await getMe(accessTokenFromCookie, cookies);

  if (refreshToken && !user) {
    const { accessToken } = (await refreshAccessToken(refreshToken)) || {};

    if (!accessToken) {
      serverRedirect(res, "/");
      return null;
    }

    const userFromRefreshedToken = await getMe(accessToken, cookies);

    if (!userFromRefreshedToken) {
      serverRedirect(res, "/");
      return null;
    }

    return { user: userFromRefreshedToken, accessToken };
  }

  if (!user || !accessTokenFromCookie || !refreshToken) {
    serverRedirect(res, "/");
    return null;
  }

  return { user, accessToken: accessTokenFromCookie };
}
