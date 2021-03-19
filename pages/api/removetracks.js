import { removeTracksFromPlaylists } from "../../lib/spotify";

export default async function playlists(req, res) {
  try {
    const data = await removeTracksFromPlaylists(
      req.body.accessToken,
      req.body.tracks
    );
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
}
