import { getSpotifyAuthorization } from "../../lib/spotify";

export default async function login(req, res) {
  try {
    const data = await getSpotifyAuthorization(req.body.code);
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
}
