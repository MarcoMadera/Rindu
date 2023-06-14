import { callSpotifyApi } from "./callSpotifyApi";

interface IAddCustomPlaylistImage {
  user_id: string | undefined;
  playlist_id: string | undefined;
  imageId?: string;
  accessToken?: string;
  cookies?: string;
}

const getCoverData = (imageId?: string) => {
  const cover: HTMLElement | null = document.getElementById(
    imageId ?? "cover-image"
  );

  if (!cover) return null;

  const canvas = document.createElement("canvas");
  canvas.width = cover.clientWidth;
  canvas.height = cover.clientHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.drawImage(cover as HTMLImageElement, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg");
  return dataUrl.split(",")[1];
};

export async function addCustomPlaylistImage({
  user_id,
  playlist_id,
  imageId,
  accessToken,
  cookies,
}: IAddCustomPlaylistImage): Promise<boolean> {
  if (!playlist_id || !user_id) return false;

  const coverData = getCoverData(imageId);
  if (!coverData) return false;

  const res = await callSpotifyApi({
    endpoint: `/users/${user_id}/playlists/${playlist_id}/images`,
    method: "PUT",
    accessToken,
    cookies,
    body: coverData,
  });

  return res.ok;
}
