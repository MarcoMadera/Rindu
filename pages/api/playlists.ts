import { getAllTracksFromPlaylist, getUserPlaylists } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function playlists(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.body.playlistId) {
    try {
      const data = await getAllTracksFromPlaylist(
        req.body.accessToken,
        req.body.playlistId,
        req.body.market
      );
      return res.json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  try {
    const data = await getUserPlaylists(
      req.body.accessToken,
      req.body.offset,
      req.body.playlistLimit
    );
    return res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
}
