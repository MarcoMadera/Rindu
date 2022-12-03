import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function removeTracksFromPlaylist(
  playlistId: string | undefined | null,
  positions: number[],
  snapshotId: string | undefined | null,
  accessToken?: string
): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse | null> {
  if (!playlistId || !snapshotId) return null;

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
      body: JSON.stringify({
        positions: positions,
        snapshot_id: snapshotId,
      }),
    }
  );
  if (res.ok) {
    const data =
      (await res.json()) as SpotifyApi.RemoveTracksFromPlaylistResponse;
    return data;
  }
  return null;
}
