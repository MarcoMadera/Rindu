import { getSpotifyAuthorization } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";
import { getMe } from "utils/spotifyCalls/getMe";

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const cookies = req.headers.cookie;
  if (req.body.accessToken) {
    try {
      const data = await getMe(req.body.accessToken, cookies);
      return res.json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  if (req.body.code) {
    try {
      const data = await getSpotifyAuthorization(req.body.code);

      return res.json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  return res.status(400).json({ message: "bad request" });
}
