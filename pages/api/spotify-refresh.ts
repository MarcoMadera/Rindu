import { getRefreshAccessToken } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const data = await getRefreshAccessToken(req.body.refreshToken);
    res.json(data);
  } catch ({ body }) {
    res.status(body.error.status).json(body.error);
  }
}
