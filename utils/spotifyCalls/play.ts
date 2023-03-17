import { Dispatch, SetStateAction } from "react";

import { refreshAccessToken } from "utils/spotifyCalls";

export async function play(
  accessToken: string,
  deviceId: string,
  options: { context_uri?: string; uris?: string[]; offset?: number },
  setAccessToken: Dispatch<SetStateAction<string | undefined>>,
  ignore?: boolean
): Promise<Response> {
  const { context_uri, offset, uris } = options;
  const body: {
    context_uri?: string;
    uris?: string[];
    offset?: { position: number };
    position_ms: number;
  } = { position_ms: 0 };

  if (offset !== undefined) {
    body.offset = { position: offset };
  }

  if (context_uri) {
    body.context_uri = context_uri;
  } else if (Array.isArray(uris) && uris.length) {
    body.uris = [...new Set(uris)];
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (res.status === 401 && !ignore) {
    const { access_token: newAccessToken } = (await refreshAccessToken()) || {};
    if (newAccessToken) {
      setAccessToken(newAccessToken);
      await play(newAccessToken, deviceId, options, setAccessToken, true);
    }
  }
  return res;
}
