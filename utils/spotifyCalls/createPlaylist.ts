import { handleJsonResponse } from "utils/handleJsonResponse";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function createPlaylist(
  user_id: string | undefined,
  options: {
    accessToken?: string;
    cookies?: string;
    name?: string;
    description?: string;
  }
): Promise<SpotifyApi.CreatePlaylistResponse | null> {
  if (!user_id) return null;
  const { name, description, accessToken, cookies } = options || {};

  const res = await callSpotifyApi({
    endpoint: `/users/${user_id}/playlists`,
    method: "POST",
    accessToken,
    cookies,
    body: JSON.stringify({
      name: name ?? "New Playlist",
      description: description ?? "Your playlist created in Rindu",
      public: false,
    }),
  });

  return handleJsonResponse<SpotifyApi.CreatePlaylistResponse>(res);
}
