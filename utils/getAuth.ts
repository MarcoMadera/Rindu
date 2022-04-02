import { NextApiResponse } from "next";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants";
import { takeCookie } from "./cookies";
import { serverRedirect } from "./serverRedirect";
import { refreshAccessToken } from "./spotifyCalls/refreshAccessToken";
import { validateAccessToken } from "./spotifyCalls/validateAccessToken";

export async function getAuth(
  res: NextApiResponse,
  cookies: string
): Promise<{ user: SpotifyApi.UserObjectPrivate; accessToken: string } | null> {
  const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE, cookies);
  const accessTokenFromCookie = takeCookie(ACCESS_TOKEN_COOKIE, cookies);
  const user = await validateAccessToken(accessTokenFromCookie);

  if (refreshToken && !user) {
    const { accessToken } = (await refreshAccessToken(refreshToken)) || {};

    if (!accessToken) {
      serverRedirect(res, "/");
      return null;
    }

    const userFromRefreshedToken = await validateAccessToken(accessToken);

    if (!userFromRefreshedToken) {
      serverRedirect(res, "/");
      return null;
    }

    return { user: userFromRefreshedToken, accessToken };
  }

  if (!user || !accessTokenFromCookie) {
    serverRedirect(res, "/");
    return null;
  }

  return { user, accessToken: accessTokenFromCookie };
}
