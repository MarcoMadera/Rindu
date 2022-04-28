import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { HeaderType, normalTrackTypes } from "types/spotify";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect, useState } from "react";
import List from "layouts/playlist/List";
import { Heart, HeartShape } from "components/icons/Heart";
import Titles from "components/forPlaylistsPage/Titles";
import useSpotify from "hooks/useSpotify";
import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import useHeader from "hooks/useHeader";
import { ExtraHeader } from "layouts/playlist/ExtraHeader";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getAlbumById } from "utils/spotifyCalls/getAlbumById";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { checkIfUserFollowAlbums } from "utils/spotifyCalls/checkIfUserFollowAlbums";
import { unFollowAlbums } from "utils/spotifyCalls/unFollowAlbums";
import { followAlbums } from "utils/spotifyCalls/followAlbums";
import { PlaylistPageHeader } from "components/forPlaylistsPage/PlaylistPageHeader";
import { SITE_URL } from "utils/constants";

interface CurrentUserProps {
  album: SpotifyApi.SingleAlbumResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
  tracks: normalTrackTypes[] | null;
  tracksInLibrary: boolean[] | null;
}

const CurrentUser: NextPage<CurrentUserProps> = ({
  album,
  user,
  accessToken,
  tracks,
  tracksInLibrary,
}) => {
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const { setAllTracks, setPlaylistDetails } = useSpotify();
  const router = useRouter();
  const [isPin, setIsPin] = useState(false);
  const [isFollowingThisAlbum, setIsFollowingThisAlbum] = useState(false);
  const { setElement } = useHeader({
    showOnFixed: false,
  });

  useEffect(() => {
    async function fetchData() {
      const userFollowThisAlbum = await checkIfUserFollowAlbums(
        [album?.id || ""],
        accessToken
      );
      setIsFollowingThisAlbum(!!userFollowThisAlbum?.[0]);
    }
    fetchData();
  }, [accessToken, album?.id, user?.id]);

  useEffect(() => {
    if (!album) {
      router.push("/");
    }

    setElement(() => <ExtraHeader />);
    trackWithGoogleAnalitycs();

    setIsLogin(true);

    setAccessToken(accessToken);

    setUser(user);

    setAllTracks(tracks ?? []);

    if (!album) {
      return;
    }

    setPlaylistDetails({
      collaborative: false,
      description: "",
      external_urls: album.external_urls,
      followers: { href: null, total: 0 },
      href: album.href,
      id: album.id,
      images: album.images,
      name: album.name,
      tracks: {
        href: album.tracks.href,
        total: album.tracks.total,
        items: [],
        limit: album.tracks.limit,
        next: album.tracks.next,
        offset: album.tracks.offset,
        previous: album.tracks.previous,
      },
      owner: {
        type: "user",
        href: "",
        images: [],
        external_urls: { spotify: "" },
        id: "",
        uri: "",
        display_name: "",
        followers: { href: null, total: 0 },
      },
      public: true,
      snapshot_id: "",
      type: "playlist",
      uri: album.uri,
    });
  }, [
    accessToken,
    album,
    router,
    setAccessToken,
    setAllTracks,
    setIsLogin,
    setPlaylistDetails,
    setUser,
    trackWithGoogleAnalitycs,
    tracks,
    user,
    setElement,
  ]);

  return (
    <main>
      <PlaylistPageHeader
        type={
          album?.album_type === "single"
            ? HeaderType.single
            : album?.album_type === "compilation"
            ? HeaderType.compilation
            : HeaderType.album
        }
        title={album?.name ?? ""}
        coverImg={
          album?.images?.[0]?.url ??
          album?.images?.[1]?.url ??
          `${SITE_URL}/defaultSongCover.jpeg`
        }
        artists={album?.artists ?? []}
        totalTracks={album?.tracks.total ?? 0}
        release_date={album?.release_date ?? "1"}
      />
      <div className="tracksContainer">
        <div className="options">
          <PlayButton size={56} centerSize={28} />
          <div className="info">
            <button
              onClick={() => {
                if (!album) return;
                if (isFollowingThisAlbum) {
                  unFollowAlbums([album.id]).then((res) => {
                    if (res) {
                      setIsFollowingThisAlbum(false);
                    }
                  });
                } else {
                  followAlbums([album.id]).then((res) => {
                    if (res) {
                      setIsFollowingThisAlbum(true);
                    }
                  });
                }
              }}
            >
              {isFollowingThisAlbum ? (
                <Heart width={36} height={36} />
              ) : (
                <HeartShape fill="#ffffffb3" width={36} height={36} />
              )}
            </button>
          </div>
        </div>
        <div className="trc">
          <Titles type="album" setIsPin={setIsPin} isPin={isPin} />
          <List type="album" initialTracksInLibrary={tracksInLibrary} />
          <div className="copy">
            {album?.copyrights?.map(({ text }, i) => {
              return <p key={i}>{text}</p>;
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
        .copy {
          margin-top: 16px;
          padding-bottom: 24px;
        }
        p {
          font-size: 0.6875rem;
          line-height: 1rem;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          color: #b3b3b3;
          margin: 0;
        }
        div.info {
          align-self: flex-end;
          width: calc(100% - 310px);
        }
        .info button {
          margin-left: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 56px;
          height: 56px;
          min-width: 56px;
          min-height: 56px;
          background-color: transparent;
          border: none;
        }
        .info button:focus,
        .info button:hover {
          transform: scale(1.06);
        }
        .info button:active {
          transform: scale(1);
        }
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          margin: 16px 0;
          flex-direction: row;
        }
        .options,
        .trc {
          padding: 0 32px;
        }
        .trc {
          margin-bottom: 50px;
        }
      `}</style>
    </main>
  );
};

export default CurrentUser;

export async function getServerSideProps({
  params: { albumId },
  req,
  res,
}: {
  params: { albumId: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: CurrentUserProps | null;
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const album = await getAlbumById(albumId, user?.country ?? "US", accessToken);
  const trackIds = album?.tracks.items.map(({ id }: { id: string }) => id);
  const tracksInLibrary = await checkTracksInLibrary(
    trackIds ?? [],
    accessToken || ""
  );
  const tracks: normalTrackTypes[] | undefined = album?.tracks.items.map(
    (track) => {
      return {
        name: track.name,
        album: {
          images: album.images,
          id: album.id,
          name: album.name,
          artists: album.artists,
          uri: album.uri,
        },
        media_type: "audio",
        type: track.type,
        added_at: album.release_date,
        artists: track.artists,
        audio: track.preview_url,
        corruptedTrack: !track.name,
        duration: track.duration_ms,
        explicit: track.explicit,
        href: track.href,
        id: track.id,
        images: album.images,
        is_local: false,
        is_playable: track?.is_playable ?? false,
        position: track.track_number - 1,
        uri: track.uri,
      };
    }
  );

  return {
    props: {
      album,
      accessToken,
      user: user ?? null,
      tracks: tracks ?? null,
      tracksInLibrary,
    },
  };
}
