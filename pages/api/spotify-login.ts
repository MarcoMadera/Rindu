import { getSpotifyAuthorization, getSpotifyUser } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.body.accessToken) {
    try {
      const data = await getSpotifyUser(req.body.accessToken);
      return res.json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  try {
    const data = await getSpotifyAuthorization(req.body.code);
    return res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
}
