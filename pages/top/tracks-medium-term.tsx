import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { IPageDetails, ITrack } from "types/spotify";
import PlaylistLayout from "layouts/playlist";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { getTranslations, Page } from "utils/getTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { fullFilledValue } from "utils/fullFilledValue";
import { getMyTop, TopType } from "utils/spotifyCalls/getMyTop";
import { getSiteUrl } from "utils/environment";
import { TOP_TRACKS_MEDIUM_TERM_COLOR } from "utils/constants";

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
  req,
  res,
  query,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: PlaylistProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.TopTracks);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const usersTopTracksProm = getMyTop(
    TopType.TRACKS,
    accessToken,
    50,
    "medium_term",
    cookies
  );

  const [usersTopTracksSettledResult] = await Promise.allSettled([
    usersTopTracksProm,
  ]);
  const usersTopTracks = fullFilledValue(usersTopTracksSettledResult);
  if (!usersTopTracks) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const allTracks = usersTopTracks.items;
  const playListTracks =
    usersTopTracks && allTracks?.length > 0
      ? allTracks?.map((track, i) => {
          return {
            ...track,
            added_at: new Date().toISOString(),
            position: i,
          };
        })
      : null;
  const usersTopTracksIds = playListTracks?.map((item) => item.id) || [];

  const tracksInLibrary = await checkTracksInLibrary(
    usersTopTracksIds,
    accessToken,
    cookies
  );
  const pageTitle = `${translations.title} - ${translations.mediumTerm}`;

  const pageDetails: IPageDetails = {
    name: pageTitle,
    images: [
      {
        url: `${getSiteUrl()}/api/top-tracks-cover?title=${
          translations.mediumTerm
        }&color=${TOP_TRACKS_MEDIUM_TERM_COLOR}&imageUrl=${
          user?.images?.[0]?.url || ""
        }`,
      },
    ],
    owner: {
      display_name: "Spotify",
      id: "spotify",
    },
    type: "top",
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
