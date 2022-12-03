import type { NextApiRequest, NextApiResponse } from "next";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../../utils/constants";
import { ApiError } from "next/dist/server/api-utils";
import { takeCookie } from "../../utils/cookies";
import { RefreshTokenResponse } from "types/spotify";

interface IRefreshBody {
  refreshToken?: string;
}

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const {
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: client_id = "",
    SPOTIFY_CLIENT_SECRET: client_secret = "",
  } = process.env;
  const cookies = req.headers.cookie;
  const refreshTokenFromCookie = takeCookie(REFRESH_TOKEN_COOKIE, cookies);
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
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: body.refreshToken || refreshTokenFromCookie || "",
        }),
      }
    );
    const data = (await refreshTokenResponse.json()) as RefreshTokenResponse;
    const expireCookieDate = new Date();
    expireCookieDate.setTime(
      expireCookieDate.getTime() + 1000 * 60 * 60 * 24 * 30
    );
    res.setHeader("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=${
        data.access_token
      }; Path=/; expires=${expireCookieDate.toUTCString()}; SameSite=Lax;`,
      `${REFRESH_TOKEN_COOKIE}=${
        body.refreshToken || refreshTokenFromCookie || ""
      }; Path=/; expires=${expireCookieDate.toUTCString()}; SameSite=Lax;`,
      `${EXPIRE_TOKEN_COOKIE}=${
        data.expires_in
      }; Path=/; expires=${expireCookieDate.toUTCString()}; SameSite=Lax;`,
    ]);

    return res.json(data);
  } catch (error) {
    const response = error as ApiError;
    return res.status(response.statusCode).json(response.message);
  }
}
