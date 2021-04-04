import { removeTracksFromPlaylist } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function playlists(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const snapshot_id = await removeTracksFromPlaylist(
      req.body.accessToken,
      req.body.playlist,
      req.body.tracks,
      req.body.snapshotID
    );
    res.json({ snapshot_id });
  } catch (err) {
    res.status(400).json(err);
  }
}
