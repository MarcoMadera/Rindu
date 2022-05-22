import { getMyAlbums } from "./spotifyCalls/getMyAlbums";

export async function getAllAlbums(
  accessToken: string
): Promise<SpotifyApi.UsersSavedAlbumsResponse | null> {
  const limit = 50;
  const albumsData = await getMyAlbums(0, accessToken);
  if (!albumsData) return null;

  let restAlbumsData: SpotifyApi.UsersSavedAlbumsResponse | undefined;
  const max = Math.ceil(albumsData.total / limit);

  if (max <= 1) {
    return albumsData;
  }

  for (let i = 1; i < max; i++) {
    const resAlbumsData = await getMyAlbums(limit * i, accessToken);
    if (!resAlbumsData) return null;
    if (restAlbumsData) {
      restAlbumsData = {
        ...restAlbumsData,
        items: [...restAlbumsData.items, ...resAlbumsData.items],
      };
    }
  }
  if (!restAlbumsData) {
    return albumsData;
  }
  const allAlbums = {
    ...albumsData,
    items: [...albumsData.items, ...restAlbumsData.items],
  };
  return allAlbums;
}
