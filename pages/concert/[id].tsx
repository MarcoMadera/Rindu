import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { PlaylistProps } from "pages/playlist/[playlist]";
import PlaylistLayout from "layouts/playlist";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getSetList } from "utils/getSetList";
import { ITrack } from "types/spotify";
import { useEffect, useState } from "react";
import { getTranslations, Page } from "utils/getTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

const Playlist: NextPage<PlaylistProps> = (props) => {
  const [alternativeImage, setAlternativeImage] = useState<string>();
  const [artistId, setArtistId] = useState<string>();

  useEffect(() => {
    setAlternativeImage(window.history.state?.alternativeImage);
    setArtistId(window.history.state?.artistId);
  }, []);
  const tracks: ITrack[] =
    props.playListTracks?.map((track) => ({
      album: {
        images: [
          { url: alternativeImage },
          { url: alternativeImage },
          { url: alternativeImage },
        ],
      },
      ...track,
    })) || [];

  return (
    <PlaylistLayout
      isLibrary={false}
      pageDetails={{
        images: [{ url: alternativeImage }],
        ...props.pageDetails,
        owner: {
          display_name: props.pageDetails?.owner?.display_name || "",
          id: artistId || "",
        },
      }}
      playListTracks={tracks}
      tracksInLibrary={props.tracksInLibrary}
      user={props.user}
      accessToken={props.accessToken}
      translations={props.translations}
    />
  );
};

export default Playlist;

export async function getServerSideProps({
  params: { id },
  req,
  res,
  query,
}: {
  params: { id: string };
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: PlaylistProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Concert);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const setListAPIKey = process.env.SETLIST_FM_API_KEY;
  const setList = await getSetList(id, setListAPIKey);
  const trackList: ITrack[] = [];
  setList?.sets.set?.forEach((set) => {
    set.song?.forEach((song, i) => {
      trackList?.push({
        name: song.name,
        type: "track",
        is_playable: false,
        position: i,
        artists: [{ name: setList.artist.name }],
      });
    });
  });
  return {
    props: {
      accessToken: accessToken || null,
      user: user ?? null,
      playListTracks: trackList || [],
      pageDetails: {
        id,
        type: "concert",
        description: setList?.info || "",
        name: setList?.tour?.name || setList?.venue?.name || "",
        tracks: {
          total: trackList.length || 0,
        },
        owner: {
          display_name: setList?.artist?.name || "",
        },
      },
      tracksInLibrary: [],
      translations,
    },
  };
}
