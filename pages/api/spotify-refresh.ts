import { getRefreshAccessToken } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../../utils/constants";
import { ApiError } from "next/dist/server/api-utils";
import { takeCookie } from "../../utils/cookies";

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.body.refreshToken) {
    try {
      const data = await getRefreshAccessToken(req.body.refreshToken);
      const expireCookieDate = new Date();
      expireCookieDate.setDate(expireCookieDate.getDate() + 30);
      res.setHeader("Set-Cookie", [
        `${ACCESS_TOKEN_COOKIE}=${
          data.accessToken
        }; Path=/; expires=${expireCookieDate.toUTCString()};`,
        `${REFRESH_TOKEN_COOKIE}=${
          data.refreshToken
        }; Path=/; expires=${expireCookieDate.toUTCString()};`,
        `${EXPIRE_TOKEN_COOKIE}=${
          data.expiresIn
        }; Path=/; expires=${expireCookieDate.toUTCString()};`,
      ]);
      return res.json(data);
    } catch (error) {
      const response = error as ApiError;
      return res.status(response.statusCode).json(response.message);
    }
  }

  const {
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: client_id,
    SPOTIFY_CLIENT_SECRET: client_secret,
  } = process.env;

  const getAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );
  const cookies = req.headers.cookie;
  if (cookies) {
    const refreshTokenFromCookie = takeCookie(REFRESH_TOKEN_COOKIE, cookies);
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${getAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshTokenFromCookie || "",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const expireCookieDate = new Date();
      expireCookieDate.setDate(expireCookieDate.getDate() + 30);
      res.setHeader("Set-Cookie", [
        `${ACCESS_TOKEN_COOKIE}=${
          data.access_token
        }; Path=/; expires=${expireCookieDate.toUTCString()};`,
      ]);
      return res.json({ accessToken: data.access_token });
    }
  }
  return res.status(400).json({ message: "bad request" });
}
