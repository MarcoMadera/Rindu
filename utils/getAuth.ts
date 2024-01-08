import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants";
import { ServerApiContext } from "types/serverContext";
import { serverRedirect, takeCookie } from "utils";
import { getMe, refreshAccessToken } from "utils/spotifyCalls";

export async function getAuth(
  context: ServerApiContext
): Promise<{ user: SpotifyApi.UserObjectPrivate; accessToken: string } | null> {
  const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE, context);
  const accessTokenFromCookie = takeCookie(ACCESS_TOKEN_COOKIE, context);
  const user = await getMe(context);

  if (refreshToken && !user) {
    await refreshAccessToken(context);
    const access_token = takeCookie(ACCESS_TOKEN_COOKIE, context);
    if (!access_token) {
      serverRedirect(context.res, "/");
      return null;
    }

    const userFromRefreshedToken = await getMe(context);

    if (!userFromRefreshedToken) {
      serverRedirect(context.res, "/");
      return null;
    }

    return { user: userFromRefreshedToken, accessToken: access_token };
  }
  if (!user || !accessTokenFromCookie || !refreshToken) {
    serverRedirect(context.res, "/");
    return null;
  }

  return { user, accessToken: accessTokenFromCookie };
}
