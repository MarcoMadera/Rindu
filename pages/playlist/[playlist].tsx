import { ReactElement } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import PlaylistLayout from "layouts/playlist";
import { ISpotifyContext, ITrack } from "types/spotify";
import {
  deserialize,
  fullFilledValue,
  getAuth,
  getTranslations,
  mapPlaylistItems,
  Page,
  serverRedirect,
} from "utils";
import {
  checkTracksInLibrary,
  getPlaylistDetails,
  getTracksFromPlaylist,
} from "utils/spotifyCalls";

export interface PlaylistProps {
  pageDetails: ISpotifyContext["pageDetails"] | null;
  tracksInLibrary: boolean[] | null;
  playListTracks: ITrack[] | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

const Playlist = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): ReactElement | null => {
  if (!props.pageDetails) return null;
  return (
    <PlaylistLayout
      isLibrary={false}
      pageDetails={props.pageDetails}
      playListTracks={props.playListTracks}
      tracksInLibrary={props.tracksInLibrary}
      user={props.user}
      translations={props.translations}
    />
  );
};

export default Playlist;

export const getServerSideProps = (async (context) => {
  const country = (context.query.country ?? "US") as string;
  const translations = getTranslations(country, Page.Playlist);
  const cookies = context.req?.headers?.cookie;
  const playlist = context.params?.playlist;
  if (!cookies || !playlist) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const { user } = (await getAuth(context)) ?? {};

  const pageDetailsProm = getPlaylistDetails(playlist, context);
  const playlistTrackProm = getTracksFromPlaylist(playlist, 0, context);
  const [pageDetails, playlistTrackResponse] = await Promise.allSettled([
    pageDetailsProm,
    playlistTrackProm,
  ]);
  const playListTracks = mapPlaylistItems(
    fullFilledValue(playlistTrackResponse)?.items,
    0
  );

  const trackIds = playListTracks?.map(({ id }) => id);
  const tracksInLibrary = await checkTracksInLibrary(
    trackIds as string[],
    context
  );
  return {
    props: {
      pageDetails: fullFilledValue(pageDetails),
      tracksInLibrary,
      playListTracks: deserialize(playListTracks),
      user: user ?? null,
      translations,
    },
  };
}) satisfies GetServerSideProps<Partial<PlaylistProps>, { playlist: string }>;
