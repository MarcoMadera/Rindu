import { removeTracksFromPlaylist } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function playlists(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const data = await removeTracksFromPlaylist(
      req.body.accessToken,
      req.body.playlist,
      req.body.tracks,
      req.body.snapshotID
    );
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
}
