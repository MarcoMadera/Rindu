import { ReactElement } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import PlaylistLayout from "layouts/playlist";
import { IPageDetails, ITrack } from "types/spotify";
import {
  fullFilledValue,
  GeneratedImageAPI,
  getAuth,
  getGeneratedImageUrl,
  getTranslations,
  Page,
  serverRedirect,
} from "utils";
import {
  checkTracksInLibrary,
  getRecommendations,
  getTrack,
} from "utils/spotifyCalls";

export interface PlaylistProps {
  pageDetails: IPageDetails | null;
  tracksInLibrary: boolean[] | null;
  playListTracks: ITrack[] | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

const Playlist = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): ReactElement | null => {
  if (!props.pageDetails) {
    return null;
  }

  return (
    <PlaylistLayout
      pageDetails={props.pageDetails}
      isLibrary={false}
      playListTracks={props.playListTracks}
      tracksInLibrary={props.tracksInLibrary}
      user={props.user}
      translations={props.translations}
      isGeneratedPlaylist={true}
    />
  );
};

export default Playlist;

export const getServerSideProps = (async (context) => {
  const country = (context.query.country ?? "US") as string;
  const trackId = context.params?.trackId;
  const translations = getTranslations(country, Page.Radio);
  const cookies = context.req?.headers?.cookie;
  if (!cookies || !trackId) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const { user } = (await getAuth(context)) ?? {};

  const recommendedTracksProm = getRecommendations({
    seed_tracks: [trackId],
    limit: 29,
    market: user?.country,
    context,
  });
  const currentTrackProm = getTrack(trackId, user?.country ?? "US", context);

  const [recommendedTracksSettledResult, currentTrackSettledResult] =
    await Promise.allSettled([recommendedTracksProm, currentTrackProm]);
  const recommendedTracks = fullFilledValue(recommendedTracksSettledResult);
  const currentTrack = fullFilledValue(currentTrackSettledResult);
  if (!currentTrack || !recommendedTracks) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const allTracks = [currentTrack, ...recommendedTracks];
  const playListTracks =
    recommendedTracks && allTracks?.length > 0
      ? allTracks?.map((track, i) => {
          return {
            ...track,
            added_at: new Date().toISOString(),
            position: i,
          };
        })
      : null;
  const recommendedTracksIds = playListTracks?.map((item) => item.id) ?? [];

  const tracksInLibrary = await checkTracksInLibrary(
    recommendedTracksIds,
    context
  );

  const tracks: ITrack[] = playListTracks ? [...playListTracks] : [];

  const mostPopularTracks = tracks?.toSorted(
    (a, b) => (b.popularity || 0) - (a.popularity || 0)
  );
  const albumCovers = mostPopularTracks.map((track) => {
    return track.album?.images?.[0];
  });
  const currentTrackAlbumCover = currentTrack.album.images?.[0]?.url;

  const filteredAlbumCovers = albumCovers.filter(
    (cover) => cover?.url !== currentTrackAlbumCover
  );

  const cover2 = filteredAlbumCovers[0]?.url ?? albumCovers[0]?.url ?? "";
  const cover3 = filteredAlbumCovers[1]?.url ?? albumCovers[0]?.url ?? "";

  const params = {
    cover1: currentTrackAlbumCover,
    cover2,
    cover3,
    name: currentTrack.name,
  };
  const generatedImageUrl = getGeneratedImageUrl(
    GeneratedImageAPI.RadioCover,
    params
  );

  const pageDetails: IPageDetails = {
    id: trackId,
    name: `${currentTrack?.name || ""} Radio`,
    images: [{ url: generatedImageUrl }],
    owner: {
      display_name: "Spotify",
      id: "spotify",
    },
    type: "radio",
    tracks: {
      total: playListTracks?.length ?? 0,
    },
  };

  return {
    props: {
      pageDetails,
      tracksInLibrary,
      playListTracks,
      user: user ?? null,
      translations,
    },
  };
}) satisfies GetServerSideProps<Partial<PlaylistProps>, { trackId: string }>;
