import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { refreshAccessTokenRequest } from "../../lib/requests";
import { normalTrackTypes, SpotifyUserResponse } from "types/spotify";
import { ACCESSTOKENCOOKIE, REFRESHTOKENCOOKIE } from "../../utils/constants";
import { takeCookie } from "../../utils/cookies";
import { validateAccessToken } from "../../utils/validateAccessToken";
import Router, { useRouter } from "next/router";
import { ContentHeader } from "components/forPlaylistsPage/ContentHeader";
import formatNumber from "utils/formatNumber";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import List from "layouts/playlist/List";
import { Heart, HeartShape } from "components/icons/Heart";
import Titles from "components/forPlaylistsPage/Titles";
import { checkTracksInLibrary } from "lib/spotify";
import useSpotify from "hooks/useSpotify";
import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import useHeader from "hooks/useHeader";
import { ExtraHeader } from "layouts/playlist/ExtraHeader";

interface CurrentUserProps {
  album: SpotifyApi.SingleAlbumResponse;
  accessToken?: string;
  user: SpotifyUserResponse | null;
  tracks: normalTrackTypes[];
  tracksInLibrary: boolean[];
}

async function followAlbums(ids?: string[], accessToken?: string) {
  if (!ids) {
    return;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/albums?ids=${ids.join()}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
        }`,
      },
    }
  );
  return res.ok;
}
async function unFollowAlbums(ids?: string[], accessToken?: string) {
  if (!ids) {
    return;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/albums?ids=${ids.join()}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
        }`,
      },
    }
  );
  return res.ok;
}

async function checkIfUserFollowAlbums(
  albumIds?: string[],
  accessToken?: string
) {
  if (!albumIds) {
    return;
  }
  const ids = albumIds.join();
  const res = await fetch(
    `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`,
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
  const data = res.json();
  return data;
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
        [album.id],
        accessToken
      );
      setIsFollowingThisAlbum(!!userFollowThisAlbum?.[0]);
    }
    fetchData();
  }, [accessToken, album.id, user?.id]);

  useEffect(() => {
    if (!album) {
      router.push("/");
    }

    setElement(() => <ExtraHeader />);
    trackWithGoogleAnalitycs();

    setIsLogin(true);

    setAccessToken(accessToken);

    setUser(user);

    setAllTracks(tracks);

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
      <section>
        <ContentHeader>
          <img src={album?.images?.[0].url} alt="" />
          <div className="info">
            <h2>ALBUM</h2>
            <h1>{album?.name}</h1>
            <div>
              <p>
                <span className="artists">
                  {album.artists?.map((artist, i) => {
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
                  &nbsp;&middot; {new Date(album.release_date).getFullYear()}
                </span>
                <span>
                  &nbsp;&middot; {formatNumber(album.tracks.total ?? 0)} songs
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
            <Titles setIsPin={setIsPin} />
            <List type="playlist" initialTracksInLibrary={tracksInLibrary} />
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
          font-size: ${(album.name?.length ?? 0) < 20
            ? "96px"
            : (album.name?.length ?? 0) < 30
            ? "72px"
            : "48px"};
          line-height: ${(album.name?.length ?? 0) < 20
            ? "96px"
            : (album.name?.length ?? 0) < 30
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
        .trc :global(.titles) {
          border-bottom: 1px solid transparent;
          box-sizing: content-box;
          height: 36px;
          margin: ${isPin ? "0 -32px 8px" : "0 -16px 8px"};
          padding: ${isPin ? "0 32px" : "0 16px"};
          position: sticky;
          top: 60px;
          z-index: 2;
          display: grid;
          grid-gap: 16px;
          background-color: ${isPin ? "#181818" : "transparent"};
          border-bottom: 1px solid #ffffff1a;
          grid-template-columns: [index] 48px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(
              120px,
              1fr
            );
        }
        .trc :global(.titles span) {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #b3b3b3;
          font-family: sans-serif;
        }
        .trc :global(.titles span:nth-of-type(1)) {
          font-size: 16px;
          justify-self: center;
          margin-left: 16px;
        }
        .trc :global(.titles span:nth-of-type(2)) {
          margin-left: 70px;
        }
        .trc :global(.titles span:nth-of-type(5)) {
          justify-content: center;
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
  props: CurrentUserProps;
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

  async function getAlbum(albumId: string, accessToken?: string) {
    if (!accessToken || !albumId) {
      return null;
    }
    const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
        }`,
      },
    });
    const data = res.json();
    return data;
  }

  const album: SpotifyApi.SingleAlbumResponse = await getAlbum(
    albumId,
    accessToken
  );
  const trackIds = album.tracks.items.map(({ id }: { id: string }) => id);
  const tracksInLibrary = await checkTracksInLibrary(
    trackIds,
    accessToken || ""
  );
  const tracks: normalTrackTypes[] = album.tracks.items.map((track) => {
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
  });

  return {
    props: {
      album,
      accessToken,
      user: user ?? null,
      tracks,
      tracksInLibrary,
    },
  };
}
