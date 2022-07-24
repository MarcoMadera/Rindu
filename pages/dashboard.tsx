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
import { getFeaturedPlaylists } from "utils/spotifyCalls/getFeaturedPlaylists";
import { getNewReleases } from "utils/spotifyCalls/getNewReleases";
import { getCategories } from "utils/spotifyCalls/getCategories";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import useSpotify from "hooks/useSpotify";
import { takeCookie } from "utils/cookies";
import { AuthorizationResponse } from "types/spotify";
import Carousel from "components/Carousel";
import SubTitle from "components/SubtTitle";
import { CardType } from "components/CardContent";
import ContentContainer from "components/ContentContainer";
import TopTracks from "components/TopTracks";
import { isCorruptedTrack } from "utils/isCorruptedTrack";
import MainTracks from "components/MainTracks";

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
        if (track.id) seeds.push(track.id);
      });
      getRecommendations(seeds.slice(0, 5), user?.country, accessToken).then(
        (tracks) => {
          if (tracks) setRecentListeningRecommendations(tracks);
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
        return {
          ...track,
          audio: track.preview_url,
          corruptedTrack: isCorruptedTrack(track),
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setHeaderColor("#242424");
  }, [router, setHeaderColor]);

  return (
    <ContentContainer>
      {topTracks && topTracks?.items.length > 0 ? (
        <TopTracks topTracks={topTracks} />
      ) : null}
      {featuredPlaylists && featuredPlaylists?.playlists?.items?.length > 0 ? (
        <Carousel
          title={featuredPlaylists.message ?? "Disfruta de estás playlists"}
          gap={24}
        >
          {featuredPlaylists.playlists?.items?.map(
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
        <MainTracks
          title="Te van a gustar"
          tracksInLibrary={tracksInLibrary}
          tracksRecommendations={tracksRecommendations}
        />
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
  let tokens: Record<string, string | null> | AuthorizationResponse = {
    accessToken: takeCookie(ACCESS_TOKEN_COOKIE, cookies),
    refreshToken: takeCookie(REFRESH_TOKEN_COOKIE, cookies),
    expiresIn: takeCookie(EXPIRE_TOKEN_COOKIE, cookies),
  };

  if (query.code) {
    const authorization = await getAuthorizationByCode(query.code);
    if (authorization) {
      tokens = authorization;
    }
    if (!tokens.access_token) {
      serverRedirect(res, "/");
    }

    const expireCookieDate = new Date();
    expireCookieDate.setDate(expireCookieDate.getDate() + 30);
    res.setHeader("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=${
        tokens.access_token
      }; Path=/; expires=${expireCookieDate.toUTCString()};`,
      `${REFRESH_TOKEN_COOKIE}=${
        tokens.refresh_token
      }; Path=/; expires=${expireCookieDate.toUTCString()};`,
      `${EXPIRE_TOKEN_COOKIE}=${
        tokens.expires_in
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
