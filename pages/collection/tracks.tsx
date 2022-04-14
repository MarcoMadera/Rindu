import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { AllTracksFromAPlaylistResponse, ISpotifyContext } from "types/spotify";
import PlaylistLayout from "layouts/playlist";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { getMyLikedSongs } from "utils/spotifyCalls/getMyLikedSongs";

interface PlaylistProps {
  playlistDetails: ISpotifyContext["playlistDetails"];
  playListTracks: AllTracksFromAPlaylistResponse;
  tracksInLibrary: boolean[] | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
}

const Playlist: NextPage<PlaylistProps> = (props) => {
  return (
    <PlaylistLayout
      isLibrary={true}
      playlistDetails={props.playlistDetails}
      playListTracks={props.playListTracks}
      tracksInLibrary={props.tracksInLibrary}
      user={props.user}
      accessToken={props.accessToken}
    />
  );
};

export default Playlist;

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: PlaylistProps | null;
}> {
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const playListTracks = await getMyLikedSongs(
    user?.country ?? "US",
    accessToken,
    cookies
  );
  const trackIds = playListTracks?.items?.map(({ track }) => track.id);
  const tracksInLibrary = await checkTracksInLibrary(
    trackIds ?? [],
    accessToken || ""
  );

  if (!playListTracks) {
    return { props: null };
  }

  const playlistDetails: ISpotifyContext["playlistDetails"] = {
    collaborative: false,
    description: "",
    external_urls: { spotify: "https://open.spotify.com/collection/tracks" },
    followers: { total: 0, href: null },
    href: "",
    id: "tracks",
    images: [
      {
        url: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png",
        height: 300,
        width: 300,
      },
    ],
    name: "Liked Songs",
    owner: {
      id: user?.id ?? "",
      external_urls: { spotify: user?.href ?? "" },
      href: user?.href ?? "",
      type: "user",
      uri: `spotify:user:${user?.id}`,
      display_name: user?.display_name ?? "",
    },
    public: false,
    snapshot_id: "",
    tracks: {
      total: playListTracks.total ?? 0,
      previous: playListTracks.previous,
      href: playListTracks.href,
      items: playListTracks.items ?? [],
      limit: playListTracks.limit,
      next: playListTracks.next,
      offset: playListTracks.offset,
    },
    type: "collection",
    uri: `spotify:user:${user?.id}:collection`,
  };
  return {
    props: {
      playlistDetails,
      tracksInLibrary,
      playListTracks: {
        tracks: playListTracks.items.map(({ track, added_at }, i: number) => {
          return {
            name: track?.name,
            images: track?.album.images,
            uri: track?.uri,
            href: track?.external_urls.spotify,
            artists: track.artists,
            id: track?.id,
            explicit: track?.explicit,
            duration: track?.duration_ms,
            audio: track?.preview_url,
            corruptedTrack: !track?.uri,
            position: i,
            album: track.album,
            added_at,
            type: track.type,
            media_type: "audio",
            is_local: track.is_local,
          };
        }),
      },
      accessToken: accessToken ?? null,
      user: user ?? null,
    },
  };
}
