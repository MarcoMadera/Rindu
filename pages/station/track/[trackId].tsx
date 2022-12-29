import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { IPageDetails, ITrack } from "types/spotify";
import PlaylistLayout from "layouts/playlist";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { getTranslations, Page } from "utils/getTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getRecommendations } from "utils/spotifyCalls/getRecommendations";
import { getTrack } from "utils/spotifyCalls/getTrack";
import { fullFilledValue } from "utils/fullFilledValue";

export interface PlaylistProps {
  pageDetails: IPageDetails | null;
  tracksInLibrary: boolean[] | null;
  playListTracks: ITrack[] | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

const Playlist: NextPage<PlaylistProps> = (props) => {
  return (
    <PlaylistLayout
      pageDetails={props.pageDetails}
      isLibrary={false}
      playListTracks={props.playListTracks}
      tracksInLibrary={props.tracksInLibrary}
      user={props.user}
      accessToken={props.accessToken}
      translations={props.translations}
      isGeneratedPlaylist={true}
    />
  );
};

export default Playlist;

export async function getServerSideProps({
  params: { trackId },
  req,
  res,
  query,
}: {
  params: { trackId: string };
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: PlaylistProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Radio);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const recommendedTracksProm = getRecommendations({
    seed_tracks: [trackId],
    limit: 29,
    market: user?.country,
    accessToken,
  });
  const currentTrackProm = getTrack(
    trackId,
    user?.country || "US",
    accessToken
  );

  const [recommendedTracksSettledResult, currentTrackSettledResult] =
    await Promise.allSettled([recommendedTracksProm, currentTrackProm]);
  const recommendedTracks = fullFilledValue(recommendedTracksSettledResult);
  const currentTrack = fullFilledValue(currentTrackSettledResult);
  if (!currentTrack || !recommendedTracks) {
    serverRedirect(res, "/");
    return { props: null };
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
  const recommendedTracksIds = playListTracks?.map((item) => item.id) || [];

  const tracksInLibrary = await checkTracksInLibrary(
    recommendedTracksIds,
    accessToken,
    cookies
  );

  const tracks: ITrack[] = playListTracks ? [...playListTracks] : [];

  const mostPopularTracks = tracks?.sort(
    (a, b) => (b.popularity || 0) - (a.popularity || 0)
  );
  const albumCovers = mostPopularTracks.map((track) => {
    return track.album?.images?.[0];
  });
  const currentTrackAlbumCover = currentTrack.album.images?.[0]?.url;

  const filteredAlbumCovers = albumCovers.filter(
    (cover) => cover?.url !== currentTrackAlbumCover
  );

  const cover2 = filteredAlbumCovers[0]?.url || albumCovers[0]?.url || "";
  const cover3 = filteredAlbumCovers[1]?.url || albumCovers[0]?.url || "";

  const imageUrl = `/api/radio-cover?cover1=${currentTrackAlbumCover}&cover2=${cover2}&cover3=${cover3}&name=${currentTrack.name}`;

  const pageDetails: IPageDetails = {
    id: trackId,
    name: `${currentTrack?.name || ""} Radio`,
    images: [
      {
        url: imageUrl,
      },
    ],
    owner: {
      display_name: "Spotify",
      id: "spotify",
    },
    type: "radio",
    tracks: {
      total: playListTracks?.length || 0,
    },
  };

  return {
    props: {
      pageDetails,
      tracksInLibrary,
      playListTracks,
      accessToken: accessToken ?? null,
      user: user ?? null,
      translations,
    },
  };
}
