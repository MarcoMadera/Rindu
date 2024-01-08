import type { ServerApiContext } from "types/serverContext";
import {
  ACCESS_TOKEN_COOKIE,
  getSiteUrl,
  handleJsonResponse,
  makeCookie,
  REFRESH_TOKEN_COOKIE,
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
  const response = await fetch(`${getSiteUrl()}/api/spotify-refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await handleJsonResponse<IRefreshAccessTokenResponse>(response);

  if (data) {
    makeCookie({
      name: REFRESH_TOKEN_COOKIE,
      value: data.refresh_token,
      context,
    });
    makeCookie({
      name: ACCESS_TOKEN_COOKIE,
      value: data.access_token,
      context,
    });
  }
}
