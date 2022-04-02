import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { normalTrackTypes } from "types/spotify";
import { useRouter } from "next/router";
import { ContentHeader } from "components/forPlaylistsPage/ContentHeader";
import formatNumber from "utils/formatNumber";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
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
  const { setElement } = useHeader({ showOnFixed: false });

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

  const albumName = album?.name ?? "";

  return (
    <main>
      <section>
        <ContentHeader>
          <img src={album?.images?.[0].url} alt="" />
          <div className="info">
            <h2>ALBUM</h2>
            <h1>{album?.name}</h1>
            <div>
              <p>
                <span className="artists">
                  {album?.artists?.map((artist, i) => {
                    return (
                      <Fragment key={artist.id}>
                        <Link href={`/artist/${artist.id}`}>
                          <a>{artist.name}</a>
                        </Link>
                        {i !==
                        (album.artists?.length && album.artists?.length - 1)
                          ? ", "
                          : null}
                      </Fragment>
                    );
                  })}
                </span>
                <span>
                  &nbsp;&middot;{" "}
                  {new Date(album?.release_date ?? 1).getFullYear()}
                </span>
                <span>
                  &nbsp;&middot; {formatNumber(album?.tracks.total ?? 0)} songs
                </span>
              </p>
            </div>
          </div>
        </ContentHeader>
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
          </div>
        </div>
      </section>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
        div.info {
          align-self: flex-end;
          width: calc(100% - 310px);
        }
        h1 {
          color: #fff;
          margin: 0;
          pointer-events: none;
          user-select: none;
          padding: 0.08em 0px;
          font-size: ${(albumName?.length ?? 0) < 20
            ? "96px"
            : (albumName?.length ?? 0) < 30
            ? "72px"
            : "48px"};
          line-height: ${(albumName?.length ?? 0) < 20
            ? "96px"
            : (albumName?.length ?? 0) < 30
            ? "72px"
            : "48px"};
          visibility: visible;
          width: 100%;
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: none;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          line-break: anywhere;
          -webkit-line-clamp: 3;
        }
        h2 {
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
          font-weight: 700;
        }
        img {
          box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
          margin-right: 15px;
          align-self: center;
          align-self: flex-end;
          height: 232px;
          margin-inline-end: 24px;
          min-width: 232px;
          width: 232px;
        }
        .artists a {
          color: white;
          font-weight: 800;
          font-size: 15px;
          text-decoration: none;
          font-family: "Lato";
        }
        .artists a:hover {
          text-decoration: underline;
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
          flex-direction: row;
        }
        .trc {
          margin-bottom: 50px;
        }
        .tracksContainer {
          padding: 0 32px;
        }
        section {
          display: flex;
          flex-direction: column;
          margin: 0 auto;
          padding: 0;
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

  const album = await getAlbumById(albumId, accessToken);
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
