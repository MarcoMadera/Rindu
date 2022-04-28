import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect, useState, ReactElement } from "react";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getArtistById } from "utils/spotifyCalls/getArtistById";
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
import { PlaylistPageHeader } from "components/forPlaylistsPage/PlaylistPageHeader";
import { HeaderType } from "types/spotify";
import { SITE_URL } from "utils/constants";
import { getYear } from "utils/getYear";
import Carousel from "components/Carousel";

interface ArtistPageProps {
  currentArtist: SpotifyApi.SingleArtistResponse | null;
  topTracks: SpotifyApi.MultipleTracksResponse | null;
  singleAlbums: SpotifyApi.ArtistsAlbumsResponse | null;
  appearAlbums: SpotifyApi.ArtistsAlbumsResponse | null;
  relatedArtists: SpotifyApi.ArtistsRelatedArtistsResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
}

export default function ArtistPage({
  currentArtist,
  topTracks,
  singleAlbums,
  appearAlbums,
  relatedArtists,
  user,
  accessToken,
}: ArtistPageProps): ReactElement {
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const { setElement } = useHeader();
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
  }, [accessToken, currentArtist?.id, router]);

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
      type: "artist",
      href: "",
    });
    setAllTracks(
      tracks.items.map((track) => ({
        ...track,
        audio: track.preview_url,
        type: "track",
      }))
    );
  }, [
    topTracks,
    setElement,
    setPlaylistDetails,
    router,
    setAllTracks,
    currentArtist?.name,
    currentArtist?.id,
    currentArtist?.images,
    currentArtist?.external_urls.spotify,
    currentArtist?.uri,
    currentArtist?.followers?.total,
  ]);

  return (
    <main>
      <PlaylistPageHeader
        type={HeaderType.artist}
        title={currentArtist?.name ?? ""}
        coverImg={
          currentArtist?.images?.[0]?.url ??
          currentArtist?.images?.[1]?.url ??
          `${SITE_URL}/defaultSongCover.jpeg`
        }
        totalFollowers={currentArtist?.followers?.total ?? 0}
        popularity={currentArtist?.popularity ?? 0}
      />
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
          {topTracks?.tracks &&
            topTracks?.tracks?.map((track, i) => {
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
                  isSingleTrack
                  position={i}
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
          <Carousel title={"Albums"} gap={24}>
            {singleAlbums?.items?.map(
              ({ images, name, id, artists, release_date }) => {
                const artistNames = artists.map((artist) => artist.name);
                const subTitle = release_date
                  ? `${getYear(release_date)} · Album`
                  : artistNames.join(", ");
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
              }
            )}
          </Carousel>
        ) : null}
        {appearAlbums && appearAlbums?.items?.length > 0 ? (
          <Carousel title={"Aparece en"} gap={24}>
            {appearAlbums?.items?.map(
              ({ images, name, id, artists, release_date }) => {
                const artistNames = artists.map((artist) => artist.name);
                const subTitle = release_date
                  ? `${getYear(release_date)} · Album`
                  : artistNames.join(", ");
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
              }
            )}
          </Carousel>
        ) : null}
        {relatedArtists && relatedArtists?.artists?.length > 0 ? (
          <Carousel title={"Te pueden gustar"} gap={24}>
            {relatedArtists?.artists?.map(({ images, name, id }) => {
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
          </Carousel>
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
        .content {
          margin: 32px;
          padding-bottom: 30px;
          position: relative;
        }
        .topTracks {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 32px;
        }
      `}</style>
    </main>
  );
}

export async function getServerSideProps({
  params: { artistId },
  req,
  res,
}: {
  params: { artistId: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: ArtistPageProps | null;
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
