import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils/handleJsonResponse";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function createPlaylist(
  user_id: string | undefined,
  options?: {
    name?: string;
    description?: string;
  },
  context?: ServerApiContext
): Promise<SpotifyApi.CreatePlaylistResponse | null> {
  if (!user_id) return null;
  const { name, description } = options ?? {};

  const res = await callSpotifyApi({
    endpoint: `/users/${user_id}/playlists`,
    method: "POST",
    context,
    body: JSON.stringify({
      name: name ?? "New Playlist",
      description: description ?? "Your playlist created in Rindu",
      public: false,
    }),
  });

  return handleJsonResponse<SpotifyApi.CreatePlaylistResponse>(res);
}
