import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function play(
  deviceId: string,
  options: { context_uri?: string; uris?: string[]; offset?: number },
  context?: ServerApiContext
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

  const res = await callSpotifyApi({
    endpoint: `/me/player/play?device_id=${deviceId}`,
    method: "PUT",
    body: JSON.stringify(body),
    context,
  });
  return res;
}
