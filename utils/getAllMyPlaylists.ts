import { getUserPlaylists } from "utils/spotifyCalls";

export async function getAllMyPlaylists(): Promise<SpotifyApi.ListOfCurrentUsersPlaylistsResponse | null> {
  const limit = 50;
  const playlistsData = await getUserPlaylists(0, 50);

  let restPlaylistsData:
    | SpotifyApi.ListOfCurrentUsersPlaylistsResponse
    | undefined;

  if (!playlistsData) return null;
  const max = Math.ceil(playlistsData.total / limit);

  if (max <= 1) {
    return playlistsData;
  }

  for (let i = 1; i < max; i++) {
    const resPlaylistsData = await getUserPlaylists(limit * i, 50);
    if (restPlaylistsData && resPlaylistsData) {
      restPlaylistsData = {
        ...restPlaylistsData,
        items: [...restPlaylistsData.items, ...resPlaylistsData.items],
      };
    } else if (resPlaylistsData) {
      restPlaylistsData = resPlaylistsData;
    }
  }
  if (!restPlaylistsData) {
    return playlistsData;
  }
  const allPlaylists = {
    ...playlistsData,
    items: [...playlistsData.items, ...restPlaylistsData.items],
  };
  return allPlaylists;
}
