import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { refreshAccessTokenRequest } from "../../lib/requests";
import {
  AllTracksFromAPlaylistResponse,
  SpotifyUserResponse,
} from "types/spotify";
import { ACCESSTOKENCOOKIE, REFRESHTOKENCOOKIE } from "../../utils/constants";
import { takeCookie } from "../../utils/cookies";
import { validateAccessToken } from "../../utils/validateAccessToken";
import Router from "next/router";
import PlaylistLayout from "layouts/playlist";
import { checkTracksInLibrary } from "lib/spotify";

interface PlaylistProps {
  playlistDetails: SpotifyApi.SinglePlaylistResponse;
  playListTracks: AllTracksFromAPlaylistResponse;
  tracksInLibrary: boolean[];
  accessToken?: string;
  user: SpotifyUserResponse | null;
}

const Playlist: NextPage<PlaylistProps> = (props) => {
  return (
    <PlaylistLayout
      type="saved"
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
  props: PlaylistProps;
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const refreshToken = takeCookie(REFRESHTOKENCOOKIE, cookies);
  let accessToken = takeCookie(ACCESSTOKENCOOKIE, cookies);
  const user = await validateAccessToken(accessToken);

  try {
    if (refreshToken && !user) {
      const re = await refreshAccessTokenRequest(refreshToken);
      if (!re.ok) {
        res.writeHead(307, { Location: "/" });
        res.end();
      }
      const refresh = await re.json();
      accessToken = refresh.accessToken;
    } else {
      accessToken = cookies
        ? takeCookie(ACCESSTOKENCOOKIE, cookies)
        : undefined;
    }

    if (!cookies) {
      res.writeHead(307, { Location: "/" });
      res.end();
    }
  } catch (error) {
    console.log(error);
  }

  if (!user) {
    if (res) {
      res.writeHead(307, { Location: "/" });
      res.end();
    } else {
      Router.replace("/");
    }
  }

  const _res = await fetch(
    "https://api.spotify.com/v1/me/tracks?limit=50&offset=0",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
        }`,
      },
    }
  );
  const playListTracks: SpotifyApi.PlaylistTrackResponse = await _res.json();
  const trackIds = playListTracks.items.map(({ track }) => track.id);
  const tracksInLibrary = await checkTracksInLibrary(
    trackIds,
    accessToken || ""
  );

  const playlistDetails: SpotifyApi.SinglePlaylistResponse = {
    collaborative: false,
    description: "",
    external_urls: { spotify: "https://open.spotify.com/collection/tracks" },
    followers: { total: 0, href: null },
    href: "",
    id: "",
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
      uri: `spotify:user${user?.id}`,
      display_name: user?.name ?? "",
    },
    public: false,
    snapshot_id: "",
    tracks: {
      total: playListTracks.total ?? 0,
      previous: playListTracks.previous,
      href: playListTracks.href,
      items: [],
      limit: playListTracks.limit,
      next: playListTracks.next,
      offset: playListTracks.offset,
    },
    type: "playlist",
    uri: "",
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
      accessToken,
      user: user ?? null,
    },
  };
}
