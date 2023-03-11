import { NextApiResponse } from "next";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants";
import { AuthorizationResponse } from "types/spotify";
import { serverRedirect, takeCookie } from "utils";
import { getMe, refreshAccessToken } from "utils/spotifyCalls";

export async function getAuth(
  res: NextApiResponse,
  cookies: string,
  tokens?: Record<string, string | null> | AuthorizationResponse
): Promise<{ user: SpotifyApi.UserObjectPrivate; accessToken: string } | null> {
  const refreshToken =
    tokens?.refresh_token ?? takeCookie(REFRESH_TOKEN_COOKIE, cookies);
  const accessTokenFromCookie =
    tokens?.access_token ?? takeCookie(ACCESS_TOKEN_COOKIE, cookies);
  const user = await getMe(accessTokenFromCookie, cookies);
  if (refreshToken && !user) {
    const { access_token } = (await refreshAccessToken(refreshToken)) || {};

    if (!access_token) {
      serverRedirect(res, "/");
      return null;
    }

    const userFromRefreshedToken = await getMe(access_token, cookies);

    if (!userFromRefreshedToken) {
      serverRedirect(res, "/");
      return null;
    }

    return { user: userFromRefreshedToken, accessToken: access_token };
  }

  if (!user || !accessTokenFromCookie || !refreshToken) {
    serverRedirect(res, "/");
    return null;
  }

  return { user, accessToken: accessTokenFromCookie };
}
