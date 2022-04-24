import { NextApiRequest, NextApiResponse, NextPage } from "next";
import React, { useEffect, useState } from "react";
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
import ModalCardTrack from "components/forPlaylistsPage/CardTrack";
import { getFeaturedPlaylists } from "utils/spotifyCalls/getFeaturedPlaylists";
import { getNewReleases } from "utils/spotifyCalls/getNewReleases";
import { getCategories } from "utils/spotifyCalls/getCategories";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import FirstTrackContainer from "components/FirstTrackContainer";
import useSpotify from "hooks/useSpotify";
import { getYear } from "utils/getYear";
import { takeCookie } from "utils/cookies";
import { RefreshResponse } from "types/spotify";
import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import { getMainColorFromImage } from "utils/getMainColorFromImage";
import Link from "next/link";

interface ISingleTrackCard {
  track: SpotifyApi.TrackObjectFull;
}

function SingleTrackCard({ track }: ISingleTrackCard) {
  const { setHeaderColor } = useHeader({
    showOnFixed: false,
    alwaysDisplayColor: true,
  });
  const [mainTrackColor, setMainTrackColor] = useState<string>();
  return (
    <Link href={`/track/${track.id}`}>
      <a
        onMouseEnter={() => {
          setHeaderColor((prev) => {
            return mainTrackColor ?? prev;
          });
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track.album.images[0].url}
          alt={track.name}
          id={`cover-image-${track.id}`}
          onLoad={() => {
            setMainTrackColor(
              (prev) => getMainColorFromImage(`cover-image-${track.id}`) ?? prev
            );
          }}
        />
        <div>
          <p>{track.name}</p>
          <span>
            <PlayButton isSingle track={track} centerSize={24} size={48} />
          </span>
        </div>
        <style jsx>
          {`
            img {
              width: 80px;
              height: 80px;
              border-radius: 4px 0 0 4px;
              box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
              background-color: rgba(255, 255, 255, 0.2);
            }
            span {
              border-radius: 500px;
              box-shadow: 0 8px 8px rgb(0 0 0 / 30%);
              display: flex;
              opacity: 0;
              position: relative;
              transition: all 0.3s ease;
              margin-left: 8px;
              flex-shrink: 0;
            }
            a {
              display: flex;
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
              height: 80px;
              position: relative;
              transition: background-color 0.3s ease;
              text-decoration: none;
            }
            a:hover,
            a:focus {
              background-color: rgba(255, 255, 255, 0.2);
            }
            a:hover span,
            a:focus span {
              opacity: 1;
            }
            div {
              display: flex;
              color: #fff;
              flex: 1;
              justify-content: space-between;
              padding: 0 16px;
              align-items: center;
            }
            p {
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              white-space: normal;
              word-break: break-word;
              font-size: 1rem;
              line-height: 1.5rem;
              text-transform: none;
              letter-spacing: normal;
              margin: 0;
            }
          `}
        </style>
      </a>
    </Link>
  );
}

interface DashboardProps {
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | null;
  featuredPlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse | null;
  newReleases: SpotifyApi.ListOfNewReleasesResponse | null;
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  topTracks: SpotifyApi.UsersTopTracksResponse | null;
  tracksRecommendations: SpotifyApi.TrackObjectFull[] | null;
  tracksInLibrary: boolean[] | null;
}

const Dashboard: NextPage<DashboardProps> = ({
  user,
  accessToken,
  featuredPlaylists,
  newReleases,
  categories,
  topTracks,
  tracksRecommendations,
  tracksInLibrary,
}) => {
  const { setIsLogin, setUser } = useAuth();
  const { setHeaderColor } = useHeader({
    showOnFixed: false,
    alwaysDisplayColor: true,
  });
  const router = useRouter();
  const { setAllTracks } = useSpotify();

  useEffect(() => {
    if (!user) return;
    setIsLogin(true);

    setUser(user);
  }, [setIsLogin, setUser, user]);

  useEffect(() => {
    if (!tracksRecommendations) return;
    setAllTracks(() => {
      return tracksRecommendations?.map((track) => ({
        ...track,
        audio: track.preview_url,
        corruptedTrack: false,
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setHeaderColor("#242424");
  }, [router, setHeaderColor]);

  return (
    <>
      <main>
        {topTracks && topTracks?.items.length > 0 ? (
          <>
            <h2>Esto te encanta</h2>
            <section className="top-tracks">
              {topTracks &&
                topTracks?.items?.map((track, i) => {
                  if (i >= 9) return null;
                  return <SingleTrackCard key={track.id} track={track} />;
                })}
            </section>
          </>
        ) : null}
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
                ({ images, name, id, artists, release_date }) => {
                  const artistNames = artists.map((artist) => artist.name);
                  const subTitle = release_date
                    ? `Album · ${getYear(release_date)} · ${artistNames.join(
                        ", "
                      )}`
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
            </section>
          </>
        ) : null}
        {tracksRecommendations && tracksRecommendations?.length > 0 && (
          <>
            <h2>Te van a gustar</h2>
            <section className="tracks">
              <FirstTrackContainer
                track={tracksRecommendations?.[0]}
                preview={tracksRecommendations?.[0].preview_url}
              />
              <div className="trackSearch">
                {tracksRecommendations?.map((track, i) => {
                  if (i === 0 || i > 4) {
                    return null;
                  }
                  return (
                    <ModalCardTrack
                      accessToken={accessToken ?? ""}
                      isTrackInLibrary={tracksInLibrary?.[i] ?? false}
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
                      position={i}
                      isSingleTrack
                    />
                  );
                })}
              </div>
            </section>
          </>
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
          grid-template-columns: 49% 49%;
          width: 100%;
          grid-gap: 20px;
          margin: 10px 0 30px;
        }
        .top-tracks {
          grid-gap: 16px 24px;
          display: grid;
          grid-template: auto/repeat(auto-fill, minmax(max(270px, 25%), 1fr));
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
        h2 {
          color: #fff;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 45px;
          text-transform: none;
          margin: 0;
          z-index: 1;
          position: relative;
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
  let tokens: Record<string, string | null> | RefreshResponse = {
    accessToken: takeCookie(ACCESS_TOKEN_COOKIE, cookies),
    refreshToken: takeCookie(REFRESH_TOKEN_COOKIE, cookies),
    expiresIn: takeCookie(EXPIRE_TOKEN_COOKIE, cookies),
  };

  if (query.code) {
    const authorization = await getAuthorizationByCode(query.code);
    if (authorization) {
      tokens = authorization;
    }
    if (!tokens.accessToken) {
      serverRedirect(res, "/");
    }

    const expireCookieDate = new Date();
    expireCookieDate.setDate(expireCookieDate.getDate() + 30);
    res.setHeader("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=${
        tokens.accessToken
      }; Path=/; expires=${expireCookieDate.toUTCString()};`,
      `${REFRESH_TOKEN_COOKIE}=${
        tokens.refreshToken
      }; Path=/; expires=${expireCookieDate.toUTCString()};`,
      `${EXPIRE_TOKEN_COOKIE}=${
        tokens.expiresIn
      }; Path=/; expires=${expireCookieDate.toUTCString()};`,
    ]);
  }

  const { accessToken, user } = (await getAuth(res, cookies, tokens)) || {};

  const featuredPlaylistsProm = getFeaturedPlaylists(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );
  const newReleasesProm = getNewReleases(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );

  const categoriesProm = getCategories(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );
  const topTracksProm = getMyTopTracks(accessToken, 10, "short_term", cookies);

  const [featuredPlaylists, newReleases, categories, topTracks] =
    await Promise.allSettled([
      featuredPlaylistsProm,
      newReleasesProm,
      categoriesProm,
      topTracksProm,
    ]);

  const seed_tracks =
    topTracks.status === "fulfilled"
      ? topTracks.value?.items?.map((item) => item.id) ?? []
      : [];

  const tracksRecommendations = await getRecommendations(
    seed_tracks.slice(0, 5),
    user?.country ?? "US",
    accessToken
  );

  const recommendedTracksIds =
    tracksRecommendations?.map((item) => item.id) || [];

  const tracksInLibrary = await checkTracksInLibrary(
    recommendedTracksIds,
    accessToken,
    cookies
  );

  return {
    props: {
      user: user || null,
      accessToken: accessToken ?? null,
      featuredPlaylists:
        featuredPlaylists.status === "fulfilled"
          ? featuredPlaylists.value
          : null,
      newReleases:
        newReleases.status === "fulfilled" ? newReleases.value : null,
      categories: categories.status === "fulfilled" ? categories.value : null,
      topTracks: topTracks.status === "fulfilled" ? topTracks.value : null,
      tracksRecommendations,
      tracksInLibrary,
    },
  };
}
