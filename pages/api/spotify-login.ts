import type { NextApiRequest, NextApiResponse } from "next";

import { AuthorizationResponse } from "types/spotify";
import { ENABLE_PKCE_AUTH } from "utils";
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
  const body = req.body as ILoginBody;
  const context = { req, res };
  if (body.accessToken) {
    try {
      const data = await getMe(context);
      return res.json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  if (body.code) {
    try {
      const params: Record<string, string> = {
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL as string,
        code: body.code,
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
      };

      if (ENABLE_PKCE_AUTH) {
        if (!body.code_verifier) {
          throw new Error("Verification failed");
        }

        params["code_verifier"] = body.code_verifier;
      }

      if (!ENABLE_PKCE_AUTH) {
        if (!process.env.SPOTIFY_CLIENT_SECRET) {
          throw new Error("Client secret is required for non-auth code flow");
        }

        params["client_secret"] = process.env.SPOTIFY_CLIENT_SECRET;
      }

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
