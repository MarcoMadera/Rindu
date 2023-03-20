import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

interface IAddCustomPlaylistImage {
  user_id: string | undefined;
  playlist_id: string | undefined;
  imageId?: string;
  accessToken?: string;
  cookies?: string;
}

export async function addCustomPlaylistImage({
  user_id,
  playlist_id,
  imageId,
  accessToken,
  cookies,
}: IAddCustomPlaylistImage): Promise<boolean> {
  if (!playlist_id || !user_id) return false;
  const getCoverData = () => {
    const cover: HTMLElement | null = document.getElementById(
      imageId ?? "cover-image"
    );
    if (cover) {
      const canvas = document.createElement("canvas");
      canvas.width = cover.clientWidth;
      canvas.height = cover.clientHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          cover as HTMLImageElement,
          0,
          0,
          canvas.width,
          canvas.height
        );
        const dataUrl = canvas.toDataURL("image/jpeg");
        return dataUrl.split(",")[1];
      }
    }
    return null;
  };
  const coverData = getCoverData();
  if (!coverData) return false;
  const res = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/images`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg",
        Authorization: `Bearer ${
          accessToken
            ? accessToken
            : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
        }`,
      },
      body: coverData,
    }
  );

  return res.ok;
}
