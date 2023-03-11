import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

import PlaylistLayout from "layouts/playlist";
import { IPageDetails, ITrack } from "types/spotify";
import {
  fullFilledValue,
  getAuth,
  getSiteUrl,
  getTranslations,
  Page,
  serverRedirect,
  TOP_TRACKS_SHORT_TERM_COLOR,
} from "utils";
import { checkTracksInLibrary, getMyTop } from "utils/spotifyCalls";
import { TopType } from "utils/spotifyCalls/getMyTop";

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
    "short_term",
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
  const pageTitle = `${translations.title} - ${translations.shortTerm}`;

  const pageDetails: IPageDetails = {
    name: pageTitle,
    images: [
      {
        url: `${getSiteUrl()}/api/top-tracks-cover?title=${
          translations.shortTerm
        }&color=${TOP_TRACKS_SHORT_TERM_COLOR}&imageUrl=${
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
