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
import { AuthorizationResponse, ITrack } from "types/spotify";
import Carousel from "components/Carousel";
import SubTitle from "components/SubtTitle";
import { CardType } from "components/CardContent";
import ContentContainer from "components/ContentContainer";
import TopTracks from "components/TopTracks";
import MainTracks from "components/MainTracks";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getTranslations, Page } from "utils/getTranslations";
import { fullFilledValue } from "utils/fullFilledValue";
import { searchArtist, searchTrack } from "utils/spotifyCalls/search";

interface DashboardProps {
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | null;
  featuredPlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse | null;
  newReleases: SpotifyApi.ListOfNewReleasesResponse | null;
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  topTracks: SpotifyApi.UsersTopTracksResponse | null;
  topArtists: SpotifyApi.UsersTopArtistsResponse | null;
  tracksRecommendations: ITrack[] | null;
  tracksInLibrary: boolean[] | null;
  translations: Record<string, string>;
  artistOfTheWeek: SpotifyApi.ArtistObjectFull[] | null;
  tracksOfTheWeek: SpotifyApi.TrackObjectFull[] | null;
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
  translations,
  artistOfTheWeek,
  tracksOfTheWeek,
}) => {
  const { setUser } = useAuth();
  const { setHeaderColor } = useHeader({
    showOnFixed: true,
    alwaysDisplayColor: false,
  });
  const router = useRouter();
  const { recentlyPlayed } = useSpotify();
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
          if (Array.isArray(tracks)) setRecentListeningRecommendations(tracks);
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

    setUser(user);
  }, [setUser, user]);

  useEffect(() => {
    setHeaderColor("#242424");
  }, [router, setHeaderColor]);

  return (
    <ContentContainer>
      {topTracks && topTracks.items.length > 0 ? (
        <TopTracks
          heading={translations.topTracksHeading}
          topTracks={topTracks}
        />
      ) : null}
      {featuredPlaylists && featuredPlaylists.playlists?.items?.length > 0 ? (
        <Carousel
          title={
            featuredPlaylists.message ?? translations.featuredPlaylistsHeading
          }
          gap={24}
        >
          {featuredPlaylists.playlists?.items?.map((item) => {
            if (!item) return null;
            const { images, name, description, id, owner } = item;
            return (
              <PresentationCard
                type={CardType.PLAYLIST}
                key={id}
                images={images}
                title={name}
                subTitle={
                  decode(description) ||
                  `${translations.by} ${owner?.display_name ?? ""}`
                }
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      {artistOfTheWeek && artistOfTheWeek.length > 0 ? (
        <Carousel title={translations.artistOfTheWeekHeading} gap={24}>
          {artistOfTheWeek.map((artist) => {
            if (!artist) return null;
            return (
              <PresentationCard
                type={CardType.ARTIST}
                key={artist.id}
                images={artist.images}
                title={artist.name}
                subTitle={"Artist"}
                id={artist.id}
              />
            );
          })}
        </Carousel>
      ) : null}
      {tracksOfTheWeek && tracksOfTheWeek.length > 0 && (
        <MainTracks
          title={translations.tracksOfTheWeekHeading}
          tracksInLibrary={[]}
          tracksRecommendations={tracksOfTheWeek}
        />
      )}
      {recentlyPlayed && recentlyPlayed.length > 0 ? (
        <Carousel title={translations.recentlyListenedHeading} gap={24}>
          {recentlyPlayed.map((track) => {
            return (
              <PresentationCard
                type={track.type ?? CardType.TRACK}
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
        <Carousel
          title={newReleases.message ?? translations.newReleasesHeading}
          gap={24}
        >
          {newReleases.albums?.items?.map((item) => {
            if (!item) return null;
            const { images, name, id, artists, album_type } = item;
            return (
              <PresentationCard
                type={CardType.ALBUM}
                key={id}
                images={images}
                title={name}
                subTitle={<SubTitle artists={artists} albumType={album_type} />}
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      {tracksRecommendations && tracksRecommendations.length > 0 && (
        <MainTracks
          title={translations.tracksRecommendationsHeading}
          tracksInLibrary={tracksInLibrary}
          tracksRecommendations={tracksRecommendations}
        />
      )}
      {recentListeningRecommendations.length > 0 ? (
        <Carousel
          title={translations.recentListeningRecommendationsHeading}
          gap={24}
        >
          {recentListeningRecommendations.map((track) => {
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
        <Carousel title={translations.topArtistsHeading} gap={24}>
          {topArtists.items?.map((item) => {
            if (!item) return null;
            const { images, name, id } = item;
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
      {categories && categories.items?.length > 0 ? (
        <Carousel title={translations.categories} gap={24}>
          {categories.items.map((item) => {
            if (!item) return null;
            const { name, id, icons } = item;
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

interface IArtistOfTheWeek {
  artists: {
    artist: {
      name: string;
    }[];
  };
}
async function getArtistsOfTheWeek(apiKey: string): Promise<IArtistOfTheWeek> {
  const artistsOfTheWeekRes = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`
  );
  const artistsOfTheWeek =
    (await artistsOfTheWeekRes.json()) as IArtistOfTheWeek;
  return artistsOfTheWeek;
}
interface ITracksOfTheWeek {
  tracks: {
    track: {
      name: string;
      artist: {
        name: string;
      };
    }[];
  };
}
async function getTracksOfTheWeek(apiKey: string): Promise<ITracksOfTheWeek> {
  const tracksOfTheWeekRes = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json`
  );
  const tracksOfTheWeek = (await tracksOfTheWeekRes.json()) as ITracksOfTheWeek;
  return tracksOfTheWeek;
}

export async function getServerSideProps({
  res,
  req,
  query,
}: {
  res: NextApiResponse;
  req: NextApiRequest;
  query: NextParsedUrlQuery & { code?: string };
}): Promise<{
  props: DashboardProps;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Dashboard);
  const cookies = req?.headers?.cookie ?? "";
  const lastFMAPIKey = process.env.LAST_FM_API_KEY as string;
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
    expireCookieDate.setTime(
      expireCookieDate.getTime() + 1000 * 60 * 60 * 24 * 30
    );
    res.setHeader("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=${
        tokens.access_token ?? ""
      }; Path=/; expires=${expireCookieDate.toUTCString()}; SameSite=Lax; Secure;`,
      `${REFRESH_TOKEN_COOKIE}=${
        tokens.refresh_token ?? ""
      }; Path=/; expires=${expireCookieDate.toUTCString()}; SameSite=Lax; Secure;`,
      `${EXPIRE_TOKEN_COOKIE}=${
        tokens.expires_in ?? ""
      }; Path=/; expires=${expireCookieDate.toUTCString()}; SameSite=Lax; Secure;`,
    ]);
  }

  const { accessToken, user } = (await getAuth(res, cookies, tokens)) || {};
  const artistsOfTheWeekProm = getArtistsOfTheWeek(lastFMAPIKey);
  const tracksOfTheWeekProm = getTracksOfTheWeek(lastFMAPIKey);

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

  const [
    featuredPlaylists,
    newReleases,
    categories,
    topTracks,
    topArtists,
    artistsOfTheWeek,
    tracksOfTheWeek,
  ] = await Promise.allSettled([
    featuredPlaylistsProm,
    newReleasesProm,
    categoriesProm,
    topTracksProm,
    topArtistsProm,
    artistsOfTheWeekProm,
    tracksOfTheWeekProm,
  ]);

  const seed_tracks =
    fullFilledValue(topTracks)?.items?.map((item) => item.id) ?? [];

  const tracksRecommendationsProm = getRecommendations(
    seed_tracks.slice(0, 5),
    user?.country ?? "US",
    accessToken
  );

  const artistsOfTheWeekSettled = fullFilledValue(artistsOfTheWeek);
  const tracksOfTheWeekSettled = fullFilledValue(tracksOfTheWeek);
  const artistResult: SpotifyApi.ArtistObjectFull[] = [];
  const tracksResult: SpotifyApi.TrackObjectFull[] = [];
  let tracksRecommendations: SpotifyApi.TrackObjectFull[] | null = [];

  const searchedArtistsPromises: Promise<
    SpotifyApi.ArtistObjectFull[] | null
  >[] = [];
  const searchedTracksPromises: Promise<SpotifyApi.TrackObjectFull[] | null>[] =
    [];

  if (artistsOfTheWeekSettled) {
    artistsOfTheWeekSettled.artists.artist.forEach((artist) => {
      searchedArtistsPromises.push(searchArtist(artist.name, accessToken));
    });
  }

  if (tracksOfTheWeekSettled) {
    tracksOfTheWeekSettled.tracks.track.forEach((track) => {
      searchedTracksPromises.push(
        searchTrack(
          `track:${track.name}${
            track?.artist?.name ? `%20artist:${track?.artist?.name}` : ""
          }`,
          accessToken
        )
      );
    });
  }

  const searchedArtistsPromisesLenght = searchedArtistsPromises.length;

  const result = await Promise.allSettled([
    tracksRecommendationsProm,
    ...searchedArtistsPromises,
    ...searchedTracksPromises,
  ]);

  result.forEach((item, i) => {
    if (i === 0) {
      tracksRecommendations = fullFilledValue(item) as
        | SpotifyApi.TrackObjectFull[]
        | null;
      return;
    }
    const fullFilledItem = fullFilledValue(item);
    if (
      fullFilledItem &&
      i <= searchedArtistsPromisesLenght &&
      fullFilledItem[0]
    ) {
      artistResult.push(fullFilledItem[0] as SpotifyApi.ArtistObjectFull);
      return;
    }
    if (fullFilledItem && fullFilledItem[0]) {
      tracksResult.push(fullFilledItem[0] as SpotifyApi.TrackObjectFull);
    }
  });

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
      featuredPlaylists: fullFilledValue(featuredPlaylists),
      newReleases: fullFilledValue(newReleases),
      categories: fullFilledValue(categories),
      topTracks: fullFilledValue(topTracks),
      topArtists: fullFilledValue(topArtists),
      artistOfTheWeek: artistResult,
      tracksOfTheWeek: tracksResult,
      tracksRecommendations,
      tracksInLibrary,
      translations,
    },
  };
}
