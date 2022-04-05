import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useRouter } from "next/router";
import { ContentHeader } from "components/forPlaylistsPage/ContentHeader";
import formatNumber from "utils/formatNumber";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect, useState } from "react";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getArtistById } from "utils/spotifyCalls/getArtistById";
import { getMainColorFromImage } from "utils/getMainColorFromImage";
import useHeader from "hooks/useHeader";
import { getArtistTopTracks } from "utils/spotifyCalls/getArtistTopTracks";
import ModalCardTrack from "components/forPlaylistsPage/CardTrack";
import useSpotify from "hooks/useSpotify";
import { ExtraHeader } from "layouts/playlist/ExtraHeader";
import {
  getArtistAlbums,
  Include_groups,
} from "utils/spotifyCalls/getArtistAlbums";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import { getRelatedArtists } from "utils/spotifyCalls/getRelatedArtists";
import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import { follow, Follow_type } from "utils/spotifyCalls/follow";
import { unFollow } from "utils/spotifyCalls/unFollow";
import { checkIfUserFollowArtistUser } from "utils/spotifyCalls/checkIfUserFollowArtistUser";

interface CurrentUserProps {
  currentArtist: SpotifyApi.SingleArtistResponse | null;
  topTracks: SpotifyApi.MultipleTracksResponse | null;
  singleAlbums: SpotifyApi.ArtistsAlbumsResponse | null;
  appearAlbums: SpotifyApi.ArtistsAlbumsResponse | null;
  relatedArtists: SpotifyApi.ArtistsRelatedArtistsResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
}

const CurrentUser: NextPage<CurrentUserProps> = ({
  currentArtist,
  topTracks,
  singleAlbums,
  appearAlbums,
  relatedArtists,
  user,
  accessToken,
}) => {
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const { headerColor, setHeaderColor, setElement } = useHeader();
  const router = useRouter();
  const { setPlaylistDetails, setAllTracks } = useSpotify();
  const [showMoreTopTracks, setShowMoreTopTracks] = useState(false);
  const [isFollowingThisArtist, setIsFollowingThisArtist] = useState(false);
  useEffect(() => {
    if (!currentArtist) {
      router.push("/");
    }
    trackWithGoogleAnalitycs();

    setIsLogin(true);

    setAccessToken(accessToken);

    setUser(user);
  }, [
    accessToken,
    currentArtist,
    router,
    setAccessToken,
    setIsLogin,
    setUser,
    trackWithGoogleAnalitycs,
    user,
  ]);

  useEffect(() => {
    checkIfUserFollowArtistUser(
      Follow_type.artist,
      currentArtist?.id,
      accessToken
    ).then((res) => {
      setIsFollowingThisArtist(res);
    });
  }, []);

  useEffect(() => {
    setElement(() => <ExtraHeader />);
    const user: SpotifyApi.UserObjectPublic = {
      display_name: currentArtist?.name,
      id: currentArtist?.id ?? "",
      images: currentArtist?.images,
      external_urls: { spotify: currentArtist?.external_urls.spotify ?? "" },
      href: "",
      uri: "",
      type: "user",
    };

    const items =
      topTracks?.tracks.map((track) => ({
        ...track,
        added_at: "",
        added_by: user,
        track: track,
        is_local: false,
      })) ?? [];

    const tracks = {
      href: "",
      total: 10,
      items: items,
      next: "",
      previous: "",
      limit: 0,
      offset: 0,
    };

    setPlaylistDetails({
      name: currentArtist?.name ?? "",
      images: [{ url: "", height: 0, width: 0 }],
      uri: currentArtist?.uri ?? "",
      followers: { href: null, total: currentArtist?.followers?.total ?? 0 },
      collaborative: false,
      description: currentArtist?.name ?? "",
      id: currentArtist?.id ?? "",
      tracks: tracks,
      external_urls: { spotify: currentArtist?.external_urls?.spotify ?? "" },
      owner: user,
      public: false,
      snapshot_id: "",
      type: "playlist",
      href: "",
    });
    setAllTracks(
      tracks.items.map((track) => ({
        ...track,
        audio: track.preview_url,
        type: "track",
      }))
    );
  }, [topTracks, setElement, setPlaylistDetails, router, setAllTracks]);

  return (
    <main>
      <ContentHeader>
        <img
          src={currentArtist?.images?.[0].url}
          alt=""
          id="cover-image"
          onLoad={() => {
            setHeaderColor(
              (prev) => getMainColorFromImage("cover-image") ?? prev
            );
          }}
        />
        <div className="info">
          <h2>ARTIST</h2>
          <h1>{currentArtist?.name}</h1>
          <div>
            <p>
              <span>
                {formatNumber(currentArtist?.followers?.total ?? 0)} seguidores
              </span>
              <span>
                &nbsp;&middot; {formatNumber(currentArtist?.popularity ?? 0)}{" "}
                popularity
              </span>
            </p>
          </div>
        </div>
      </ContentHeader>
      <div className="bg-12"></div>
      <div className="options">
        <PlayButton size={56} centerSize={28} />
        <div className="info button-inof">
          <button
            className="follow-button"
            onClick={() => {
              if (isFollowingThisArtist) {
                unFollow(
                  Follow_type.artist,
                  currentArtist?.id,
                  accessToken
                ).then((res) => {
                  if (res) {
                    setIsFollowingThisArtist(false);
                  }
                });
              } else {
                follow(Follow_type.artist, currentArtist?.id, accessToken).then(
                  (res) => {
                    if (res) {
                      setIsFollowingThisArtist(true);
                    }
                  }
                );
              }
            }}
          >
            {isFollowingThisArtist ? "Siguiendo" : "Seguir"}
          </button>
        </div>
      </div>
      <div className="content">
        <h3>Popular</h3>
        <div className="topTracks">
          {topTracks?.tracks?.map((track, i) => {
            const maxToShow = showMoreTopTracks ? 10 : 5;
            if (i >= maxToShow) {
              return null;
            }
            return (
              <ModalCardTrack
                accessToken={accessToken ?? ""}
                isTrackInLibrary={false}
                playlistUri=""
                track={{
                  ...track,
                  media_type: "audio",
                  audio: track.preview_url,
                  images: track.album.images,
                  duration: track.duration_ms,
                  position: i,
                }}
                key={track.id}
                type="playlist"
              />
            );
          })}
        </div>
        <button
          className="show-more"
          onClick={() => {
            setShowMoreTopTracks((prev) => !prev);
          }}
        >
          {showMoreTopTracks ? "MOSTRAR MENOS" : "MOSTRAR MÁS"}
        </button>
        {singleAlbums && singleAlbums?.items?.length > 0 ? (
          <>
            <h3>Albums</h3>
            <section className="playlists">
              {singleAlbums?.items?.map(({ images, name, id, artists }) => {
                const artistNames = artists.map((artist) => artist.name);
                const subTitle = artistNames.join(", ");
                return (
                  <PresentationCard
                    type="album"
                    key={id}
                    images={images}
                    title={name}
                    subTitle={subTitle}
                    id={id}
                  />
                );
              })}
            </section>
          </>
        ) : null}
        {appearAlbums && appearAlbums?.items?.length > 0 ? (
          <>
            <h3>Aparece en</h3>
            <section className="playlists">
              {appearAlbums?.items?.map(({ images, name, id, artists }) => {
                const artistNames = artists.map((artist) => artist.name);
                const subTitle = artistNames.join(", ");
                return (
                  <PresentationCard
                    type="album"
                    key={id}
                    images={images}
                    title={name}
                    subTitle={subTitle}
                    id={id}
                  />
                );
              })}
            </section>
          </>
        ) : null}
        {relatedArtists && relatedArtists?.artists?.length > 0 ? (
          <>
            <h3>Te pueden gustar</h3>
            <section className="playlists">
              {relatedArtists?.artists?.map(({ images, name, id }, i) => {
                if (i > 4) {
                  return;
                }
                return (
                  <PresentationCard
                    type="artist"
                    key={id}
                    images={images}
                    title={name}
                    subTitle={"Artist"}
                    id={id}
                  />
                );
              })}
            </section>
          </>
        ) : null}
      </div>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
        .content button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 18px;
          font-weight: bold;
        }
        button.show-more:hover,
        button:hover {
          color: white;
        }
        div.info {
          align-self: flex-end;
          width: calc(100% - 310px);
        }
        .info.button-inof {
          align-self: center;
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
          min-height: 20px;
          max-height: min-content;
        }
        .info .follow-button {
          height: min-content;
        }
        .info button:focus,
        .info button:hover {
          border-color: #fff;
        }
        .info button:active {
          border-color: #fff;
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
        .bg-12 {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6) 0, #121212 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          height: 232px;
          position: absolute;
          width: 100%;
          background-color: ${headerColor ?? "transparent"};
        }
        .info button {
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          box-sizing: border-box;
          color: #fff;
          font-size: 16px;
          width: auto;
          font-weight: 700;
          letter-spacing: 0.1em;
          line-height: 16px;
          padding: 7px 15px;
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          margin-right: 24px;
        }
        h1 {
          color: #fff;
          margin: 0;
          pointer-events: none;
          user-select: none;
          padding: 0.08em 0px;
          font-size: ${(currentArtist?.name?.length ?? 0) < 20
            ? "96px"
            : (currentArtist?.name?.length ?? 0) < 30
            ? "72px"
            : "48px"};
          line-height: ${(currentArtist?.name?.length ?? 0) < 20
            ? "96px"
            : (currentArtist?.name?.length ?? 0) < 30
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
        .content {
          margin: 32px;
          padding-bottom: 30px;
          position: relative;
        }
        .playlists {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-gap: 24px;
          margin: 20px 0 50px 0;
          justify-content: space-between;
        }
        h2 {
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
          font-weight: 700;
        }
        .topTracks {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 32px;
        }
        img {
          border-radius: 50%;
          box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
          margin-right: 15px;
          align-self: center;
          align-self: flex-end;
          height: 232px;
          margin-inline-end: 24px;
          min-width: 232px;
          width: 232px;
          object-fit: cover;
          object-position: center center;
        }
      `}</style>
    </main>
  );
};

export default CurrentUser;

export async function getServerSideProps({
  params: { artistId },
  req,
  res,
}: {
  params: { artistId: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: CurrentUserProps | null;
}> {
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const currentArtist = await getArtistById(artistId, accessToken, cookies);
  const topTracks = await getArtistTopTracks(
    artistId,
    user?.country ?? "US",
    accessToken,
    cookies
  );
  const singleAlbums = await getArtistAlbums(
    artistId,
    user?.country ?? "US",
    Include_groups.single,
    accessToken,
    cookies
  );
  const appearAlbums = await getArtistAlbums(
    artistId,
    user?.country ?? "US",
    Include_groups.appears_on,
    accessToken,
    cookies
  );

  const relatedArtists = await getRelatedArtists(
    artistId,
    accessToken,
    cookies
  );

  return {
    props: {
      currentArtist,
      singleAlbums,
      appearAlbums,
      topTracks,
      relatedArtists,
      accessToken,
      user: user ?? null,
    },
  };
}
