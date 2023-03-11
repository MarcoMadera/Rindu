import { getMyShows } from "utils/spotifyCalls";

export async function getAllMyShows(
  accessToken: string
): Promise<SpotifyApi.UsersSavedShowsResponse | null> {
  const limit = 50;
  const showsData = await getMyShows(0, accessToken);
  if (!showsData) return null;

  let restShowsData: SpotifyApi.UsersSavedShowsResponse | undefined;
  const max = Math.ceil(showsData.total / limit);

  if (max <= 1) {
    return showsData;
  }

  for (let i = 1; i < max; i++) {
    const resAlbumsData = await getMyShows(limit * i, accessToken);
    if (!resAlbumsData) return null;
    if (restShowsData) {
      restShowsData = {
        ...restShowsData,
        items: [...restShowsData.items, ...resAlbumsData.items],
      };
    } else {
      restShowsData = resAlbumsData;
    }
  }
  if (!restShowsData) {
    return showsData;
  }
  const allPlaylists = {
    ...showsData,
    items: [...showsData.items, ...restShowsData.items],
  };
  return allPlaylists;
}
