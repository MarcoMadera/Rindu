import { NextApiRequest, NextApiResponse, NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../utils/constants";
import { decode } from "html-entities";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getAuthorizationByCode } from "utils/spotifyCalls/getAuthorizationByCode";
import useHeader from "hooks/useHeader";
import { useRouter } from "next/router";
import { getRecommendations } from "utils/spotifyCalls/getRecommendations";
import { getMyTopTracks } from "utils/spotifyCalls/getMyTopTracks";
import Link from "next/link";
import ModalCardTrack from "components/forPlaylistsPage/CardTrack";
import { getFeaturedPlaylists } from "utils/spotifyCalls/getFeaturedPlaylists";
import { getNewReleases } from "utils/spotifyCalls/getNewReleases";
import { getCategories } from "utils/spotifyCalls/getCategories";

interface DashboardProps {
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | null;
  featuredPlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse | null;
  newReleases: SpotifyApi.ListOfNewReleasesResponse | null;
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
}

const Dashboard: NextPage<DashboardProps> = ({
  user,
  accessToken,
  featuredPlaylists,
  newReleases,
  categories,
}) => {
  const { setIsLogin, setUser } = useAuth();
  const { setHeaderColor } = useHeader();
  const router = useRouter();
  const [tracksRecommendations, setTracksRecommendations] = useState<
    SpotifyApi.TrackObjectFull[] | null
  >([]);

  useEffect(() => {
    setIsLogin(true);

    setUser(user);
    getMyTopTracks(accessToken, 5).then((res) => {
      const seed_tracks = res?.items?.map((item) => item.id) ?? [];
      if (seed_tracks.length > 0) {
        getRecommendations(seed_tracks, accessToken).then(
          setTracksRecommendations
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setHeaderColor("#242424");
  }, [router]);

  return (
    <>
      <main>
        <header></header>
        {featuredPlaylists &&
        featuredPlaylists?.playlists?.items?.length > 0 ? (
          <>
            <h2>
              {featuredPlaylists.message ?? "Disfruta de estás playlists"}
            </h2>
            <section className="playlists">
              {featuredPlaylists.playlists?.items?.map(
                ({ images, name, description, id, owner }) => {
                  return (
                    <PresentationCard
                      type="playlist"
                      key={id}
                      images={images}
                      title={name}
                      subTitle={
                        decode(description) || `De ${owner.display_name}`
                      }
                      id={id}
                    />
                  );
                }
              )}
            </section>
          </>
        ) : null}
        {newReleases && newReleases.albums?.items?.length > 0 ? (
          <>
            <h2>{newReleases.message ?? "Lo más nuevo"}</h2>
            <section className="playlists">
              {newReleases.albums?.items?.map(
                ({ images, name, id, artists }) => {
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
                }
              )}
            </section>
          </>
        ) : null}
        <h2>Te van a gustar</h2>
        {tracksRecommendations && tracksRecommendations?.length > 0 && (
          <section className="tracks">
            <Link href={`/album/${tracksRecommendations?.[0].album.id}`}>
              <a className="firstTrack">
                <img
                  src={tracksRecommendations?.[0].album.images[1].url}
                  width={92}
                  height={92}
                  alt=""
                />
                <h3>{tracksRecommendations?.[0].name}</h3>
                <span>
                  {tracksRecommendations?.[0].artists?.map((artist, i) => {
                    return (
                      <Fragment key={artist.id}>
                        <Link href={`/artist/${artist.id}`}>
                          <a>{artist.name}</a>
                        </Link>
                        {i !==
                        (tracksRecommendations?.[0].artists?.length &&
                          tracksRecommendations?.[0].artists?.length - 1)
                          ? ", "
                          : null}
                      </Fragment>
                    );
                  })}
                </span>
              </a>
            </Link>
            <div className="trackSearch">
              {tracksRecommendations?.map((track, i) => {
                if (i === 0 || i > 4) {
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
                    }}
                    key={track.id}
                    type="presentation"
                  />
                );
              })}
            </div>
          </section>
        )}
        <h2>Categorias</h2>
        <section className="playlists">
          {categories?.items.map(({ name, id, icons }) => {
            return (
              <PresentationCard
                type="genre"
                key={id}
                images={icons}
                title={name}
                subTitle={""}
                id={id}
              />
            );
          })}
        </section>
      </main>

      <style jsx>{`
        main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .tracks {
          display: grid;
          grid-template-columns: 50% 50%;
          width: 100%;
          grid-gap: 20px;
          margin: 10px 0 30px;
        }
        h1 {
          color: #fff;
          font-weight: bold;
          margin: 0;
        }
        section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-gap: 24px;
          margin: 20px 0 50px 0;
          justify-content: space-between;
        }
        .firstTrack {
          background: #3d3a1d;
          border-radius: 4px;
          flex: 1;
          isolation: isolate;
          padding: 20px;
          position: relative;
          transition: background-color 0.3s ease;
          width: 100%;
          height: 260px;
          text-decoration: none;
        }
        .firstTrack h3 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 36px;
          text-transform: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
        }
        .firstTrack a {
          color: #b3b3b3;
          text-decoration: none;
        }
        .firstTrack a:hover,
        .firstTrack a:focus {
          text-decoration: underline;
          color: #fff;
        }
      `}</style>
    </>
  );
};
export default Dashboard;

export async function getServerSideProps({
  res,
  req,
  query,
}: {
  res: NextApiResponse;
  req: NextApiRequest;
  query: { code?: string };
}): Promise<{
  props: DashboardProps;
}> {
  const cookies = req?.headers?.cookie ?? "";

  if (query.code) {
    const tokens = await getAuthorizationByCode(query.code);
    if (!tokens) {
      serverRedirect(res, "/");
    }
    if (tokens) {
      res.setHeader("Set-Cookie", [
        `${ACCESS_TOKEN_COOKIE}=${tokens.accessToken}; Path=/;"`,
        `${REFRESH_TOKEN_COOKIE}=${tokens.refreshToken}; Path=/;"`,
        `${EXPIRE_TOKEN_COOKIE}=${tokens.expiresIn}; Path=/;"`,
      ]);
    }
  }

  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const featuredPlaylists = await getFeaturedPlaylists(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );
  const newReleases = await getNewReleases(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );

  const categories = await getCategories(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );

  return {
    props: {
      user: user || null,
      accessToken: accessToken ?? null,
      featuredPlaylists,
      newReleases,
      categories,
    },
  };
}
