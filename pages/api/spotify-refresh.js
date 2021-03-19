import { getRefreshAccessToken } from "../../lib/spotify";

export default async function refresh(req, res) {
  try {
    const data = await getRefreshAccessToken(req.body.refreshToken);
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
}
