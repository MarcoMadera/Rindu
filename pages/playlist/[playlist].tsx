import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { ISpotifyContext, ITrack } from "types/spotify";
import PlaylistLayout from "layouts/playlist";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getpageDetails } from "utils/spotifyCalls/getPlaylistDetails";
import { getTracksFromPlaylist } from "utils/spotifyCalls/getTracksFromPlayList";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { mapPlaylistItems } from "utils/mapPlaylistItems";
import { getTranslations, Page } from "utils/getTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { fullFilledValue } from "utils/fullFilledValue";

export interface PlaylistProps {
  pageDetails: ISpotifyContext["pageDetails"] | null;
  tracksInLibrary: boolean[] | null;
  playListTracks: ITrack[] | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

const Playlist: NextPage<PlaylistProps> = (props) => {
  return (
    <PlaylistLayout
      isLibrary={false}
      pageDetails={props.pageDetails}
      playListTracks={props.playListTracks}
      tracksInLibrary={props.tracksInLibrary}
      user={props.user}
      accessToken={props.accessToken}
      translations={props.translations}
    />
  );
};

export default Playlist;

export async function getServerSideProps({
  params: { playlist },
  req,
  res,
  query,
}: {
  params: { playlist: string };
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: PlaylistProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Playlist);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const pageDetailsProm = getpageDetails(playlist, accessToken, cookies);
  const playlistTrackProm = getTracksFromPlaylist(
    playlist,
    0,
    accessToken,
    cookies
  );
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
    accessToken || ""
  );
  return {
    props: {
      pageDetails: fullFilledValue(pageDetails),
      tracksInLibrary,
      playListTracks,
      accessToken: accessToken ?? null,
      user: user ?? null,
      translations,
    },
  };
}
