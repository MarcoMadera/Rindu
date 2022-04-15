import { getRefreshAccessToken } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../../utils/constants";
import { ApiError } from "next/dist/server/api-utils";

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
  return res.status(400).json({ message: "bad request" });
}
