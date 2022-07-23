import { NextApiRequest, NextApiResponse, NextPage } from "next";
import React, { useEffect, useState } from "react";
import PresentationCard from "components/PresentationCard";
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
import { getMyTop, TopType } from "utils/spotifyCalls/getMyTop";
import CardTrack from "components/CardTrack";
import { getFeaturedPlaylists } from "utils/spotifyCalls/getFeaturedPlaylists";
import { getNewReleases } from "utils/spotifyCalls/getNewReleases";
import { getCategories } from "utils/spotifyCalls/getCategories";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import FirstTrackContainer from "components/FirstTrackContainer";
import useSpotify from "hooks/useSpotify";
import { takeCookie } from "utils/cookies";
import { RefreshResponse } from "types/spotify";
import SingleTrackCard from "components/SingleTrackCard";
import Carousel from "components/Carousel";
import SubTitle from "components/SubtTitle";
import { CardType } from "components/CardContent";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";

interface DashboardProps {
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | null;
  featuredPlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse | null;
  newReleases: SpotifyApi.ListOfNewReleasesResponse | null;
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  topTracks: SpotifyApi.UsersTopTracksResponse | null;
  topArtists: SpotifyApi.UsersTopArtistsResponse | null;
  tracksRecommendations: SpotifyApi.TrackObjectFull[] | null;
  tracksInLibrary: boolean[] | null;
}

function divideArray<T>(array: T[], chunkSize: number) {
  const res: T[][] = [];
  array.forEach((_, i) => {
    const condition = i % chunkSize;
    if (!condition) {
      res.push(array.slice(i, i + chunkSize));
    }
  });
  return res;
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
  topArtists,
}) => {
  const { setIsLogin, setUser } = useAuth();
  const { setHeaderColor } = useHeader({ alwaysDisplayColor: true });
  const router = useRouter();
  const { setAllTracks, recentlyPlayed } = useSpotify();
  const [recentListeningRecommendations, setRecentListeningRecommendations] =
    useState<SpotifyApi.TrackObjectFull[]>([]);

  useEffect(() => {
    if (
      recentlyPlayed.length > 0 &&
      user?.country &&
      recentListeningRecommendations.length === 0
    ) {
      const seeds: string[] = [];
      recentlyPlayed.forEach((track) => {
        if (track.id) {
          seeds.push(track.id);
        }
      });
      getRecommendations(seeds.slice(0, 5), user?.country, accessToken).then(
        (res) => {
          if (res) {
            setRecentListeningRecommendations(res);
          }
        }
      );
    }
  }, [
    recentlyPlayed,
    user,
    accessToken,
    recentListeningRecommendations.length,
  ]);

  useEffect(() => {
    if (!user) return;
    setIsLogin(true);

    setUser(user);
  }, [setIsLogin, setUser, user]);

  useEffect(() => {
    if (!tracksRecommendations) return;
    setAllTracks(() => {
      return tracksRecommendations?.map((track) => {
        const isCorrupted =
          !track?.name &&
          !track?.artists?.[0]?.name &&
          track?.duration_ms === 0;
        return {
          ...track,
          audio: track.preview_url,
          corruptedTrack: isCorrupted,
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setHeaderColor("#242424");
  }, [router, setHeaderColor]);

  return (
    <>
      <ContentContainer>
        {topTracks && topTracks?.items.length > 0 ? (
          <>
            <Heading number={2}>Esto te encanta</Heading>
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
          <Carousel
            title={featuredPlaylists.message ?? "Disfruta de estás playlists"}
            gap={24}
          >
            {featuredPlaylists &&
              featuredPlaylists.playlists?.items?.map(
                ({ images, name, description, id, owner }) => {
                  return (
                    <PresentationCard
                      type={CardType.PLAYLIST}
                      key={id}
                      images={images}
                      title={name}
                      subTitle={
                        decode(description) || `De ${owner?.display_name ?? ""}`
                      }
                      id={id}
                    />
                  );
                }
              )}
          </Carousel>
        ) : null}
        {recentlyPlayed && recentlyPlayed?.length > 0 ? (
          <Carousel title="Recién escuchaste" gap={24}>
            {recentlyPlayed.map((track) => {
              return (
                <PresentationCard
                  type={CardType.TRACK}
                  key={track.id}
                  images={track.album?.images as SpotifyApi.ImageObject[]}
                  title={track.name ?? ""}
                  subTitle={
                    track.artists ? (
                      <SubTitle
                        artists={
                          track.artists as SpotifyApi.ArtistObjectSimplified[]
                        }
                      />
                    ) : (
                      ""
                    )
                  }
                  id={track.id ?? ""}
                  isSingle
                  track={track}
                />
              );
            })}
          </Carousel>
        ) : null}
        {newReleases && newReleases.albums?.items?.length > 0 ? (
          <Carousel title={newReleases.message ?? "Lo más nuevo"} gap={24}>
            {newReleases.albums?.items?.map(
              ({ images, name, id, artists, album_type }) => {
                return (
                  <PresentationCard
                    type={CardType.ALBUM}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={
                      <SubTitle artists={artists} albumType={album_type} />
                    }
                    id={id}
                  />
                );
              }
            )}
          </Carousel>
        ) : null}
        {tracksRecommendations && tracksRecommendations?.length > 0 && (
          <>
            <Carousel title="Te van a gustar" gap={24}>
              {divideArray(tracksRecommendations, 5).map((chunk, i) => {
                return (
                  <div className="tracks" key={i}>
                    <FirstTrackContainer
                      track={chunk?.[0]}
                      preview={chunk?.[0].preview_url}
                      position={i * 5}
                    />
                    <div className="trackSearch">
                      {chunk?.map((track, chunkIndex) => {
                        if (chunkIndex === 0 || chunkIndex > 4) {
                          return null;
                        }
                        const index = i * 5 + chunkIndex;

                        return (
                          <CardTrack
                            accessToken={accessToken ?? ""}
                            isTrackInLibrary={tracksInLibrary?.[index] ?? false}
                            playlistUri=""
                            track={track}
                            key={track.id}
                            type="presentation"
                            position={index}
                            isSingleTrack
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </>
        )}
        {recentListeningRecommendations &&
        recentListeningRecommendations?.length > 0 ? (
          <Carousel title={"Basado en lo que escuchaste"} gap={24}>
            {recentListeningRecommendations?.map((track) => {
              return (
                <PresentationCard
                  type={CardType.TRACK}
                  key={track.id}
                  images={track.album.images}
                  title={track.name}
                  subTitle={<SubTitle artists={track.artists} />}
                  id={track.id}
                  isSingle
                  track={track}
                />
              );
            })}
          </Carousel>
        ) : null}
        {topArtists && topArtists.items?.length > 0 ? (
          <Carousel title={"Disfruta de tus artistas favoritos"} gap={24}>
            {topArtists.items?.map(({ images, name, id }) => {
              return (
                <PresentationCard
                  type={CardType.ARTIST}
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
        {categories && categories?.items?.length > 0 ? (
          <Carousel title={"Categorias"} gap={24}>
            {categories?.items.map(({ name, id, icons }) => {
              return (
                <PresentationCard
                  type={CardType.GENRE}
                  key={id}
                  images={icons}
                  title={name}
                  subTitle={""}
                  id={id}
                />
              );
            })}
          </Carousel>
        ) : null}
      </ContentContainer>

      <style jsx>{`
        .tracks {
          display: grid;
          grid-template-columns: 49% 49%;
          width: 100%;
          grid-gap: 20px;
          margin: 10px 0 30px;
          min-width: calc(100% - 24px);
        }
        @media (max-width: 1000px) {
          .tracks {
            grid-template-columns: 100%;
          }
        }
        .top-tracks {
          grid-gap: 16px 24px;
          display: grid;
          grid-template: auto/repeat(auto-fill, minmax(max(270px, 25%), 1fr));
        }
        section {
          display: flex;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-gap: 24px;
          margin: 20px 0 50px 0;
          justify-content: space-between;
          transition: 400ms ease-in;
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
    10,
    accessToken,
    cookies
  );
  const newReleasesProm = getNewReleases(
    user?.country ?? "US",
    10,
    accessToken,
    cookies
  );

  const categoriesProm = getCategories(
    user?.country ?? "US",
    30,
    accessToken,
    cookies
  );
  const topTracksProm = getMyTop(
    TopType.TRACKS,
    accessToken,
    10,
    "short_term",
    cookies
  );
  const topArtistsProm = getMyTop(
    TopType.ARTISTS,
    accessToken,
    20,
    "long_term",
    cookies
  );

  const [featuredPlaylists, newReleases, categories, topTracks, topArtists] =
    await Promise.allSettled([
      featuredPlaylistsProm,
      newReleasesProm,
      categoriesProm,
      topTracksProm,
      topArtistsProm,
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
      topArtists: topArtists.status === "fulfilled" ? topArtists.value : null,
      tracksRecommendations,
      tracksInLibrary,
    },
  };
}
