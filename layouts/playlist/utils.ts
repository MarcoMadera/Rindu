import { NextRouter } from "next/router";

import { IPageDetails, ITrack, PlaylistItems } from "types/spotify";
import { UseToast } from "types/toast";
import { getAllMyPlaylists } from "utils";
import {
  addCustomPlaylistImage,
  addItemsToPlaylist,
  createPlaylist,
  getPlaylistDetails,
} from "utils/spotifyCalls";

export async function handleSaveToPlaylistClick({
  addToast,
  user,
  pageDetails,
  allTracks,
  accessToken,
  setPlaylists,
  router,
}: {
  addToast: UseToast["addToast"];
  user: SpotifyApi.UserObjectPrivate | null;
  pageDetails: IPageDetails | null;
  allTracks: ITrack[];
  setPlaylists: React.Dispatch<React.SetStateAction<PlaylistItems>>;
  router: NextRouter;
  accessToken?: string;
}): Promise<void> {
  try {
    const playlist = await createCustomPlaylist({
      addToast,
      accessToken: accessToken || "",
      user,
      pageDetails,
    });

    addToast({
      message: "Playlist created, adding tracks...",
      variant: "success",
    });

    const uris = getTrackUris(allTracks);

    await addTracksToPlaylist({
      playlistId: playlist?.id || "",
      uris,
      setPlaylists,
      accessToken,
    });

    await navigateToPlaylistPage({
      playlistId: playlist?.id || "",
      accessToken,
      router,
      addToast,
    });
  } catch (e) {
    console.error(e);
    addToast({
      message: "Error creating playlist",
      variant: "error",
    });
  }
}

async function createCustomPlaylist({
  addToast,
  accessToken,
  user,
  pageDetails,
}: Pick<
  Parameters<typeof handleSaveToPlaylistClick>[0],
  "addToast" | "accessToken" | "user" | "pageDetails"
>) {
  const playlist = await createPlaylist(user?.id, {
    name: pageDetails?.name,
  });

  if (!playlist) {
    addToast({
      message: "Error creating playlist",
      variant: "error",
    });
    throw new Error("Error creating playlist");
  }

  await addCustomPlaylistImage(user?.id, playlist.id, accessToken);

  return getPlaylistDetails(playlist.id, accessToken);
}

function getTrackUris(tracks: ITrack[]) {
  return tracks.map((track) => track.uri).filter((uri) => uri) as string[];
}

async function addTracksToPlaylist({
  playlistId,
  uris,
  setPlaylists,
  accessToken,
}: Pick<
  Parameters<typeof handleSaveToPlaylistClick>[0],
  "setPlaylists" | "accessToken"
> & { playlistId: SpotifyApi.PlaylistObjectSimplified["id"]; uris: string[] }) {
  await addItemsToPlaylist(playlistId, uris);

  const userPlaylists = await getAllMyPlaylists(accessToken || "");
  if (userPlaylists) {
    setPlaylists(userPlaylists.items);
  }
}

async function navigateToPlaylistPage({
  playlistId,
  accessToken,
  router,
  addToast,
}: Pick<
  Parameters<typeof handleSaveToPlaylistClick>[0],
  "accessToken" | "router" | "addToast"
> & { playlistId: SpotifyApi.PlaylistObjectSimplified["id"] }) {
  const playlist = await getPlaylistDetails(playlistId, accessToken);

  if (playlist?.tracks && playlist?.tracks?.total > 0) {
    await router.push(`/playlist/${playlistId}`);
  } else {
    addToast({
      message: "Routing error",
      variant: "error",
    });
  }
}
