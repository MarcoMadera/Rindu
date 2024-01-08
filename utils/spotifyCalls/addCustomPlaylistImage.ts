import { callSpotifyApi } from "./callSpotifyApi";
import type { ServerApiContext } from "types/serverContext";

interface IAddCustomPlaylistImage {
  user_id: string | undefined;
  playlist_id: string | undefined;
  imageId?: string;
  context?: ServerApiContext;
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
  context,
}: IAddCustomPlaylistImage): Promise<boolean> {
  if (!playlist_id || !user_id) return false;

  const coverData = getCoverData(imageId);
  if (!coverData) return false;

  const res = await callSpotifyApi({
    endpoint: `/users/${user_id}/playlists/${playlist_id}/images`,
    method: "PUT",
    context,
    body: coverData,
  });

  return res.ok;
}
