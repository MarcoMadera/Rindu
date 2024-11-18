import { ReactElement } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import PlaylistLayout from "layouts/playlist";
import { PlaylistProps } from "pages/playlist/[playlist]";
import { ITrack } from "types/spotify";
import {
  fullFilledValue,
  GeneratedImageAPI,
  getAuth,
  getGeneratedImageUrl,
  getSetList,
  getTranslations,
  serverRedirect,
  SetList,
} from "utils";
import { getArtistById, searchTrack } from "utils/spotifyCalls";

interface ConcertProps extends PlaylistProps {
  setList: SetList | null;
  artist: SpotifyApi.SingleArtistResponse | null;
}

const Playlist = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): ReactElement | null => {
  if (!props.pageDetails) return null;

  return (
    <PlaylistLayout
      isLibrary={false}
      isGeneratedPlaylist={true}
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
  const translations = getTranslations(context);
  const cookies = context.req?.headers?.cookie;
  const id = context.params?.id;
  if (!cookies || !id) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }

  const { user } = (await getAuth(context)) ?? {};
  const artistId = id.split(".")[0];
  const setListId = id.split(".")[1];

  const setListAPIKey = process.env.SETLIST_FM_API_KEY;
  const setListProm = getSetList(setListId, setListAPIKey);
  const artistProm = getArtistById(artistId, context);
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
      if (!track.name || !track.artists?.[0].name) return null;
      const searchResultJson = await searchTrack(
        `track: ${track.name} artist: ${track.artists[0].name}`,
        1,
        context
      );
      const trackResult = searchResultJson?.[0];
      return trackResult
        ? { ...trackResult, position, added_at: setList?.eventDate ?? "" }
        : { ...track, position };
    })
  );

  const artistName = setList?.artist.name ?? artist?.name ?? "";
  const generatedImageUrl = await getGeneratedImageUrl(
    GeneratedImageAPI.ConcertCover,
    {
      artist: artistName,
      date: setList?.eventDate ?? "",
      venue: setList?.venue.name ?? "",
      img: artist?.images[0].url ?? "",
    }
  );

  return {
    props: {
      user: user ?? null,
      playListTracks: playListTracks.filter((track) => track) as ITrack[],
      pageDetails: {
        id: artist?.id ?? "",
        type: "concert",
        description: setList?.info ?? "",
        name: setList?.tour?.name ?? setList?.venue?.name ?? artist?.name ?? "",
        tracks: {
          total: trackList.length ?? 0,
        },
        owner: {
          display_name: artist?.name ?? setList?.artist?.name ?? "",
          id: artist?.id ?? "",
        },
        images: [{ url: generatedImageUrl }],
      },
      tracksInLibrary: [],
      translations,
      setList,
      artist,
      id,
    },
  };
}) satisfies GetServerSideProps<Partial<ConcertProps>, { id: string }>;
