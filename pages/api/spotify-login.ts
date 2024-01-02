import type { NextApiRequest, NextApiResponse } from "next";

import { AuthorizationResponse } from "types/spotify";
import { getMe } from "utils/spotifyCalls";

interface ILoginBody {
  accessToken?: string;
  code?: string;
  code_verifier?: string;
}

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const cookies = req.headers.cookie;
  const body = req.body as ILoginBody;
  if (body.accessToken) {
    try {
      const data = await getMe(body.accessToken, cookies);
      return res.json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  if (body.code) {
    const params: Record<string, string> = {
      grant_type: "authorization_code",
      redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL as string,
      code: body.code,
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
    };
    if (body.code_verifier) {
      params["code_verifier"] = body.code_verifier;
    }

    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(params),
        }
      );
      const data = (await tokenResponse.json()) as AuthorizationResponse;

      return res.json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  return res.status(400).json({ message: "bad request" });
}
