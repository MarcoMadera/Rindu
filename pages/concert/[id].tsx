import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { PlaylistProps } from "pages/playlist/[playlist]";
import PlaylistLayout from "layouts/playlist";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getSetList, SetList } from "utils/getSetList";
import { ITrack } from "types/spotify";
import { getTranslations, Page } from "utils/getTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getSiteUrl } from "utils/environment";
import { getArtistById } from "utils/spotifyCalls/getArtistById";
import { fullFilledValue } from "utils/fullFilledValue";

interface ConcertProps extends PlaylistProps {
  setList: SetList | null;
  artist: SpotifyApi.SingleArtistResponse | null;
}

const Playlist: NextPage<ConcertProps> = (props) => {
  const artistName = props.setList?.artist.name || props.artist?.name || "";
  const concertDate = props.setList?.eventDate || "";
  const venue = props.setList?.venue.name || "";
  return (
    <PlaylistLayout
      isLibrary={false}
      isGeneratedPlaylist={true}
      pageDetails={{
        images: [
          {
            url: `${getSiteUrl()}/api/concert-cover?artist=${artistName}&date=${concertDate}&venue=${venue}&img=${
              props.artist?.images[0].url || ""
            }`,
          },
        ],
        ...props.pageDetails,
        owner: {
          display_name: props.pageDetails?.owner?.display_name || "",
          id: props.artist?.id || "",
        },
      }}
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
  props: ConcertProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Concert);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const artistId = id.split(".")[0];
  const setListId = id.split(".")[1];

  const setListAPIKey = process.env.SETLIST_FM_API_KEY;
  const setListProm = getSetList(setListId, setListAPIKey);
  const artistProm = getArtistById(artistId, accessToken);
  const [setListSettled, artistSettled] = await Promise.allSettled([
    setListProm,
    artistProm,
  ]);
  const trackList: ITrack[] = [];
  const setList = fullFilledValue(setListSettled);
  const artist = fullFilledValue(artistSettled);

  setList?.sets.set?.forEach((set) => {
    set.song?.forEach((song, i) => {
      trackList.push({
        name: song.name,
        type: "track",
        is_playable: false,
        position: i,
        artists: [{ name: setList.artist.name, id: artist?.id }],
        added_at: setList.eventDate || "",
      });
    });
  });

  const playListTracks = await Promise.all(
    trackList.map(async (track, position) => {
      if (!track.name || !track.artists?.[0].name || !accessToken) return null;
      const searchResult = await fetch(
        `https://api.spotify.com/v1/search?q=track: ${track.name} artist: ${track.artists[0].name}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const searchResultJson =
        (await searchResult.json()) as SpotifyApi.SearchResponse;
      const trackResult = searchResultJson.tracks?.items[0];
      return trackResult
        ? { ...trackResult, position, added_at: setList?.eventDate || "" }
        : { ...track, position };
    })
  );

  return {
    props: {
      accessToken: accessToken || null,
      user: user ?? null,
      playListTracks: playListTracks.filter((track) => track) as ITrack[],
      pageDetails: {
        id,
        type: "concert",
        description: setList?.info || "",
        name: setList?.tour?.name || setList?.venue?.name || artist?.name || "",
        tracks: {
          total: trackList.length || 0,
        },
        owner: {
          display_name: artist?.name || setList?.artist?.name || "",
        },
      },
      tracksInLibrary: [],
      translations,
      setList,
      artist,
    },
  };
}
