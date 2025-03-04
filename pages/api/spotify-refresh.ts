import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import { RefreshTokenResponse } from "types/spotify";
import {
  ACCESS_TOKEN_COOKIE,
  clientId,
  enablePkceAuth,
  EXPIRE_TOKEN_COOKIE,
  makeCookie,
  REFRESH_TOKEN_COOKIE,
  spotifyClientSecret,
  takeCookie,
} from "utils";

interface IRefreshBody {
  refreshToken?: string;
}

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse<RefreshTokenResponse | string>
): Promise<void> {
  const body = req.body as IRefreshBody;
  const context = { req, res };
  const refreshTokenFromCookie = takeCookie(REFRESH_TOKEN_COOKIE, context);
  const refreshToken = body.refreshToken ?? refreshTokenFromCookie;

  try {
    if (!refreshToken) {
      throw new ApiError(400, "Missing refresh token");
    }

    const bodyContent: Record<string, string> = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    const headersContent: HeadersInit = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (!clientId) {
      throw new ApiError(400, "Missing client id");
    }

    if (!enablePkceAuth) {
      if (!spotifyClientSecret) {
        throw new ApiError(
          400,
          "Missing client secret. Please set SPOTIFY_CLIENT_SECRET in your environment variables."
        );
      }

      const authorization = `Basic ${Buffer.from(
        `${clientId}:${spotifyClientSecret}`
      ).toString("base64")}`;
      headersContent.Authorization = authorization;
    }

    if (enablePkceAuth) {
      bodyContent.client_id = clientId;
    }

    const refreshTokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: headersContent,
        body: new URLSearchParams(bodyContent),
      }
    );

    if (!refreshTokenResponse.ok) {
      throw new ApiError(400, "Bad Request");
    }

    const data = (await refreshTokenResponse.json()) as RefreshTokenResponse;
    const expireCookieDate = new Date();
    expireCookieDate.setTime(
      expireCookieDate.getTime() + 1000 * 60 * 60 * 24 * 30
    );

    makeCookie({
      name: ACCESS_TOKEN_COOKIE,
      value: data.access_token,
      age: expireCookieDate.getTime(),
      context,
    });

    makeCookie({
      name: REFRESH_TOKEN_COOKIE,
      value: refreshToken,
      age: expireCookieDate.getTime(),
      context,
    });

    makeCookie({
      name: EXPIRE_TOKEN_COOKIE,
      value: data.expires_in.toString(),
      age: expireCookieDate.getTime(),
      context,
    });

    return res.json(data);
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.message);
    }
    return res.status(500).json("Internal Server Error");
  }
}
