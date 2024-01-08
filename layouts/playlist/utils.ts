import { NextRouter } from "next/router";

import { IPageDetails, ITrack, PlaylistItems } from "types/spotify";
import { UseToast } from "types/toast";
import { CreatePlaylistError, getAllMyPlaylists } from "utils";
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
  setPlaylists,
  router,
}: {
  addToast: UseToast["addToast"];
  user: SpotifyApi.UserObjectPrivate | null;
  pageDetails: IPageDetails | null;
  allTracks: ITrack[];
  setPlaylists: React.Dispatch<React.SetStateAction<PlaylistItems>>;
  router: NextRouter;
}): Promise<void> {
  try {
    const playlist = await createCustomPlaylist({
      user,
      pageDetails,
    });

    addToast({
      message: "Playlist created, adding tracks...",
      variant: "success",
    });

    const uris = getTrackUris(allTracks);

    await addTracksToPlaylist({
      playlistId: playlist?.id ?? "",
      uris,
      setPlaylists,
    });

    await navigateToPlaylistPage({
      playlistId: playlist?.id ?? "",
      router,
      addToast,
    });
  } catch (error) {
    if (CreatePlaylistError.isThisError(error)) {
      addToast({
        message: error.message,
        variant: "error",
      });
    }
  }
}

async function createCustomPlaylist({
  user,
  pageDetails,
}: Pick<
  Parameters<typeof handleSaveToPlaylistClick>[0],
  "user" | "pageDetails"
>) {
  const playlist = await createPlaylist(user?.id, {
    name: pageDetails?.name,
  });

  if (!playlist) {
    throw new CreatePlaylistError();
  }

  await addCustomPlaylistImage({
    user_id: user?.id,
    playlist_id: playlist.id,
  });

  return getPlaylistDetails(playlist.id);
}

function getTrackUris(tracks: ITrack[]) {
  return tracks.map((track) => track.uri).filter((uri) => uri) as string[];
}

async function addTracksToPlaylist({
  playlistId,
  uris,
  setPlaylists,
}: Pick<Parameters<typeof handleSaveToPlaylistClick>[0], "setPlaylists"> & {
  playlistId: SpotifyApi.PlaylistObjectSimplified["id"];
  uris: string[];
}) {
  await addItemsToPlaylist(playlistId, uris);

  const userPlaylists = await getAllMyPlaylists();
  if (userPlaylists) {
    setPlaylists(userPlaylists.items);
  }
}

async function navigateToPlaylistPage({
  playlistId,
  router,
  addToast,
}: Pick<
  Parameters<typeof handleSaveToPlaylistClick>[0],
  "router" | "addToast"
> & { playlistId: SpotifyApi.PlaylistObjectSimplified["id"] }) {
  const playlist = await getPlaylistDetails(playlistId);

  if (playlist?.tracks && playlist?.tracks?.total > 0) {
    await router.push(`/playlist/${playlistId}`);
  } else {
    addToast({
      message: "Routing error",
      variant: "error",
    });
  }
}
