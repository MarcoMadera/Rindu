import { getRefreshAccessToken } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";
import { ACCESSTOKENCOOKIE, EXPIRETOKENCOOKIE } from "../../utils/constants";
import { ApiError } from "next/dist/server/api-utils";

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.body.refreshToken) {
    try {
      const data = await getRefreshAccessToken(req.body.refreshToken);
      res.setHeader("Set-Cookie", [
        `${ACCESSTOKENCOOKIE}=${data.accessToken}; Path=/;"`,
        `${EXPIRETOKENCOOKIE}=${data.expiresIn}; Path=/;"`,
      ]);
      return res.json(data);
    } catch (error) {
      const response = error as ApiError;
      return res.status(response.statusCode).json(response.message);
    }
  }
  return res.status(400).json({ message: "bad request" });
}
