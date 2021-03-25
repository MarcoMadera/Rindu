import { getRefreshAccessToken } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";
import { ACCESSTOKENCOOKIE, EXPIRETOKENCOOKIE } from "../../utils/constants";

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
    } catch ({ body }) {
      return res.status(body.error.status).json(body.error);
    }
  }
  return res.status(400).json({ message: "bad request" });
}
