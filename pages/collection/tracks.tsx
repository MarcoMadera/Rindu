import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

import PlaylistLayout from "layouts/playlist";
import { ISpotifyContext, ITrack } from "types/spotify";
import {
  getAuth,
  getTranslations,
  isCorruptedTrack,
  Page,
  serverRedirect,
} from "utils";
import { checkTracksInLibrary, getMyLikedSongs } from "utils/spotifyCalls";

interface PlaylistProps {
  pageDetails: ISpotifyContext["pageDetails"];
  playListTracks: ITrack[];
  tracksInLibrary: boolean[] | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

const Playlist: NextPage<PlaylistProps> = (props) => {
  return (
    <PlaylistLayout
      isLibrary={true}
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
  const translations = getTranslations(country, Page.CollectionTracks);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const playListTracks = await getMyLikedSongs(50, accessToken, cookies);
  const trackIds = playListTracks?.items
    ?.filter(({ track }) => {
      if (track?.id) {
        return true;
      }
      return false;
    })
    .map(({ track }) => track?.id) as string[] | undefined;
  const tracksInLibrary = await checkTracksInLibrary(
    trackIds ?? [],
    accessToken || ""
  );

  if (!playListTracks) {
    return { props: null };
  }

  const pageDetails: ISpotifyContext["pageDetails"] = {
    id: "tracks",
    images: [
      {
        url: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png",
      },
    ],
    name: translations.likedSongs,
    owner: {
      id: user?.id,
      display_name: user?.display_name,
    },
    tracks: {
      total: playListTracks.total,
    },
    type: "collection",
    uri: user?.id ? `spotify:user:${user.id}:collection` : "",
  };
  return {
    props: {
      pageDetails,
      tracksInLibrary,
      playListTracks: playListTracks.items.map(
        ({ track, added_at }, i: number) => {
          return {
            ...track,
            corruptedTrack: isCorruptedTrack(track),
            position: i,
            added_at,
          };
        }
      ),
      accessToken: accessToken ?? null,
      user: user ?? null,
      translations,
    },
  };
}
