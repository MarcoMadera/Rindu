import { getUserPlaylists } from "../../lib/spotify";

export default async function playlists(req, res) {
  try {
    const data = await getUserPlaylists(req.body.accessToken);
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
}
