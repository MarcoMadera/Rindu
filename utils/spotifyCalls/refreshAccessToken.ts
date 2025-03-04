import type { ServerApiContext } from "types/serverContext";
import {
  ACCESS_TOKEN_COOKIE,
  baseUrl,
  handleJsonResponse,
  makeCookie,
  REFRESH_TOKEN_COOKIE,
  removeTokensFromCookieServer,
  takeCookie,
} from "utils";

export interface IRefreshAccessTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

export async function refreshAccessToken(
  context?: ServerApiContext
): Promise<void> {
  const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE, context);
  const response = await fetch(`${baseUrl}/api/spotify-refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await handleJsonResponse<IRefreshAccessTokenResponse>(response);

  if (data?.access_token) {
    makeCookie({
      name: ACCESS_TOKEN_COOKIE,
      value: data.access_token,
      context,
    });
    if (data.refresh_token) {
      makeCookie({
        name: REFRESH_TOKEN_COOKIE,
        value: data.refresh_token,
        context,
      });
    }
  } else {
    removeTokensFromCookieServer(context?.res);
  }
}
