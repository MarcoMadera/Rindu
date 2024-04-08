import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import { RefreshTokenResponse } from "types/spotify";
import {
  ACCESS_TOKEN_COOKIE,
  ENABLE_PKCE_AUTH,
  EXPIRE_TOKEN_COOKIE,
  makeCookie,
  REFRESH_TOKEN_COOKIE,
  takeCookie,
} from "utils";

interface IRefreshBody {
  refreshToken?: string;
}

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse<RefreshTokenResponse | string>
): Promise<void> {
  const {
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: client_id = "",
    SPOTIFY_CLIENT_SECRET: client_secret = "",
  } = process.env;
  const body = req.body as IRefreshBody;
  const context = { req, res };
  const refreshTokenFromCookie = takeCookie(REFRESH_TOKEN_COOKIE, context);
  const refreshToken = body.refreshToken ?? refreshTokenFromCookie;

  try {
    if (!refreshToken) {
      throw new ApiError(400, "Bad Request");
    }

    const bodyContent: Record<string, string> = {
      grant_type: "refresh_token",
      refresh_token: body.refreshToken ?? refreshTokenFromCookie ?? "",
    };

    const headersContent: HeadersInit = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (!ENABLE_PKCE_AUTH) {
      if (!process.env.SPOTIFY_CLIENT_SECRET) {
        throw new Error("Client secret is required for non-auth code flow");
      }

      const authorization = `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`;
      headersContent.Authorization = authorization;
    }

    if (ENABLE_PKCE_AUTH) {
      bodyContent.client_id = client_id;
    }

    const refreshTokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: headersContent,
        body: new URLSearchParams(bodyContent),
      }
    );

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
    const response = error as ApiError;
    return res.status(500).json(response.message);
  }
}
