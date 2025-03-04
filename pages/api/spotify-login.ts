import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import { AuthorizationResponse } from "types/spotify";
import {
  clientId,
  enablePkceAuth,
  redirectUrl,
  spotifyClientSecret,
} from "utils";
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
      if (!clientId) {
        throw new ApiError(400, "Missing client Id");
      }
      const params: Record<string, string> = {
        grant_type: "authorization_code",
        redirect_uri: redirectUrl,
        code: body.code,
        client_id: clientId,
      };

      if (enablePkceAuth) {
        if (!body.code_verifier) {
          throw new ApiError(400, "Missing code verifier");
        }

        params["code_verifier"] = body.code_verifier;
      }

      if (!enablePkceAuth) {
        if (!spotifyClientSecret) {
          throw new ApiError(400, "Missing client secret");
        }

        params["client_secret"] = spotifyClientSecret;
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
      console.log("data", data);

      return res.json(data);
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      return res.status(400).json({ message: "bad request" });
    }
  }
  return res.status(400).json({ message: "bad request" });
}
