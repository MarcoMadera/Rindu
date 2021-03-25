import { getPlaylistDetails } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function playlist(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.body.playlistId) {
    try {
      const data = await getPlaylistDetails(
        req.body.accessToken,
        req.body.playlistId
      );
      return res.json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  return res.status(400).json({ message: "bad request" });
}
