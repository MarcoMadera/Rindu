import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import { RefreshTokenResponse } from "types/spotify";
import {
  ACCESS_TOKEN_COOKIE,
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
  const { NEXT_PUBLIC_SPOTIFY_CLIENT_ID: client_id = "" } = process.env;
  const context = { req, res };
  const refreshTokenFromCookie = takeCookie(REFRESH_TOKEN_COOKIE, context);
  const body = req.body as IRefreshBody;
  try {
    if (!body.refreshToken && !refreshTokenFromCookie) {
      throw new ApiError(400, "Bad Request");
    }
    const refreshTokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: body.refreshToken ?? refreshTokenFromCookie ?? "",
          client_id,
        }),
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
      value: body.refreshToken ?? refreshTokenFromCookie ?? "",
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
