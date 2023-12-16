import { useEffect, useState } from "react";

import { decode } from "html-entities";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";

import {
  Carousel,
  ContentContainer,
  MainTracks,
  PresentationCard,
  SubTitle,
  TopTracks,
} from "components";
import { CardType } from "components/CardContent";
import { useAuth, useHeader, useSpotify, useTranslations } from "hooks";
import { AuthorizationResponse, ITrack } from "types/spotify";
import {
  ACCESS_TOKEN_COOKIE,
  deserialize,
  EXPIRE_TOKEN_COOKIE,
  fullFilledValue,
  getArtistsOfTheWeek,
  getAuth,
  getTopTracksCards,
  getTracksOfTheWeek,
  getTranslations,
  Page,
  REFRESH_TOKEN_COOKIE,
  serverRedirect,
  takeCookie,
} from "utils";
import {
  checkTracksInLibrary,
  getAuthorizationByCode,
  getCategories,
  getFeaturedPlaylists,
  getMyTop,
  getNewReleases,
  getRecommendations,
  searchArtist,
  searchPlaylist,
  searchTrack,
} from "utils/spotifyCalls";
import { TopType } from "utils/spotifyCalls/getMyTop";

interface MappedPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyApi.ImageObject[];
  uri: string;
  type: "playlist";
  ownerDisplayName?: string;
}

interface FeaturedPlaylistsMapped {
  message?: string;
  playlists: {
    items: MappedPlaylist[] | null;
  };
}

interface DashboardProps {
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | null;
  featuredPlaylists: FeaturedPlaylistsMapped | null;
  newReleases: SpotifyApi.ListOfNewReleasesResponse | null;
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  topTracks: ITrack[] | null;
  topArtists: SpotifyApi.UsersTopArtistsResponse | null;
  tracksRecommendations: ITrack[] | null;
  tracksInLibrary: boolean[] | null;
  translations: Record<string, string>;
  artistOfTheWeek: SpotifyApi.ArtistObjectFull[] | null;
  tracksOfTheWeek: ITrack[] | null;
  thisPlaylists: MappedPlaylist[] | null;
}

const Dashboard: NextPage<DashboardProps> = ({
  featuredPlaylists,
  newReleases,
  categories,
  topTracks,
  tracksRecommendations,
  tracksInLibrary,
  topArtists,
  artistOfTheWeek,
  tracksOfTheWeek,
  thisPlaylists,
}) => {
  const { user, accessToken } = useAuth();
  const { setHeaderColor } = useHeader({
    showOnFixed: true,
    alwaysDisplayColor: false,
  });
  const { translations } = useTranslations();
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
      getRecommendations({
        seed_tracks: seeds.slice(0, 5),
        market: user?.country,
        accessToken,
      }).then((tracks) => {
        if (Array.isArray(tracks)) setRecentListeningRecommendations(tracks);
      });
    }
  }, [
    recentlyPlayed,
    user,
    accessToken,
    recentListeningRecommendations.length,
  ]);

  useEffect(() => {
    setHeaderColor("#242424");
  }, [router, setHeaderColor]);

  return (
    <ContentContainer>
      {topTracks && topTracks.length > 0 ? (
        <TopTracks
          heading={translations.topTracksHeading}
          topTracks={topTracks}
        />
      ) : null}
      {featuredPlaylists?.playlists?.items &&
      featuredPlaylists?.playlists?.items?.length > 0 ? (
        <Carousel
          title={
            featuredPlaylists.message ?? translations.featuredPlaylistsHeading
          }
          gap={24}
        >
          {featuredPlaylists.playlists?.items?.map((item) => {
            if (!item) return null;
            const { images, name, description, id, ownerDisplayName } = item;
            return (
              <PresentationCard
                type={CardType.PLAYLIST}
                key={id}
                images={images}
                title={name}
                subTitle={
                  decode(description) ??
                  `${translations.by} ${ownerDisplayName ?? ""}`
                }
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      <Carousel title={translations.topTracksPlaylistHeading} gap={24}>
        {getTopTracksCards(user, translations).map((item) => {
          if (!item) return null;
          const { images, name, id, subTitle, url } = item;
          return (
            <PresentationCard
              type={CardType.SIMPLE}
              key={name}
              images={images}
              title={name}
              id={id}
              subTitle={subTitle}
              url={url}
            />
          );
        })}
      </Carousel>
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
                type={(track.type as CardType) ?? CardType.TRACK}
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
      {thisPlaylists && thisPlaylists.length > 0 ? (
        <Carousel title={translations.thisPlaylistsHeading} gap={24}>
          {thisPlaylists?.map((item) => {
            if (!item) return null;
            const { images, name, description, id, ownerDisplayName } = item;
            return (
              <PresentationCard
                type={CardType.PLAYLIST}
                key={id}
                images={images}
                title={name}
                subTitle={
                  decode(description) ??
                  `${translations.by} ${ownerDisplayName ?? ""}`
                }
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
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

export async function getServerSideProps({
  res,
  req,
  query,
}: {
  res: NextApiResponse;
  req: NextApiRequest;
  query: NextParsedUrlQuery & { code?: string };
}): Promise<{
  props: Partial<DashboardProps>;
}> {
  const country = (query.country ?? "US") as string;
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
      return {
        props: {
          translations,
        },
      };
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

  const { accessToken, user } = (await getAuth(res, cookies, tokens)) ?? {};
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
  const topTracksMediumProm = getMyTop(
    TopType.TRACKS,
    accessToken,
    30,
    "medium_term",
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
    topTracksMedium,
  ] = await Promise.allSettled([
    featuredPlaylistsProm,
    newReleasesProm,
    categoriesProm,
    topTracksProm,
    topArtistsProm,
    artistsOfTheWeekProm,
    tracksOfTheWeekProm,
    topTracksMediumProm,
  ]);

  const seed_tracks =
    fullFilledValue(topTracks)?.items?.map((item) => item.id) ?? [];

  const tracksRecommendationsProm = getRecommendations({
    seed_tracks: seed_tracks.slice(0, 5),
    market: user?.country ?? "US",
    accessToken,
  });

  const artistsOfTheWeekSettled = fullFilledValue(artistsOfTheWeek);
  const tracksOfTheWeekSettled = fullFilledValue(tracksOfTheWeek);
  const topTracksMediumSettled = fullFilledValue(topTracksMedium);
  const artistResult: SpotifyApi.ArtistObjectFull[] = [];
  const tracksResult: SpotifyApi.TrackObjectFull[] = [];
  const thisPlaylistsResult: SpotifyApi.PlaylistObjectFull[] = [];
  let tracksRecommendations: SpotifyApi.TrackObjectFull[] | null = [];

  const searchedArtistsPromises: Promise<
    SpotifyApi.ArtistObjectFull[] | null
  >[] = [];
  const searchedTracksPromises: Promise<SpotifyApi.TrackObjectFull[] | null>[] =
    [];
  const searchedPlaylistsPromises: Promise<
    SpotifyApi.PlaylistObjectFull[] | null
  >[] = [];

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

  if (topTracksMediumSettled) {
    topTracksMediumSettled.items.forEach((track) => {
      searchedPlaylistsPromises.push(
        searchPlaylist(`This is ${track.artists[0].name}`, accessToken)
      );
    });
  }

  const searchedArtistsPromisesLenght = searchedArtistsPromises.length;
  const searchedPlaylistsPromisesLength = searchedPlaylistsPromises.length;
  const result = await Promise.allSettled([
    tracksRecommendationsProm,
    ...searchedArtistsPromises,
    ...searchedTracksPromises,
    ...searchedPlaylistsPromises,
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
    const hasFulfilledItem = fullFilledItem?.[0];
    const isAfterArtistsPromises = i > searchedArtistsPromisesLenght;
    const isBeforeOrEqualTracksPromises =
      i <= searchedArtistsPromisesLenght + searchedTracksPromises.length;

    const isValidTrack =
      hasFulfilledItem &&
      isAfterArtistsPromises &&
      isBeforeOrEqualTracksPromises;

    if (isValidTrack) {
      tracksResult.push(fullFilledItem[0] as SpotifyApi.TrackObjectFull);
      return;
    }

    if (
      fullFilledItem &&
      i > searchedArtistsPromisesLenght + searchedPlaylistsPromisesLength
    ) {
      const playlists = (
        fullFilledItem as SpotifyApi.PlaylistObjectFull[]
      ).filter((playlist) => playlist.owner.display_name === "Spotify");
      if (!playlists[0]) return;
      const isDuplicate = thisPlaylistsResult.some(
        (playlist) => playlist.id === playlists[0].id
      );
      if (!isDuplicate) {
        thisPlaylistsResult.push(playlists[0]);
      }
    }
  });

  const recommendedTracksIds =
    tracksRecommendations?.map((item) => item.id) ?? [];

  const tracksInLibrary = await checkTracksInLibrary(
    recommendedTracksIds,
    accessToken,
    cookies
  );

  function mappedFeaturedPlaylists(
    item: SpotifyApi.ListOfFeaturedPlaylistsResponse | null
  ) {
    if (!item) return null;
    return {
      message: item.message,
      playlists: {
        items: mappedPlaylistData(item.playlists.items),
      },
    };
  }

  function mappedPlaylistData(
    items: SpotifyApi.PlaylistObjectSimplified[] | null | undefined
  ) {
    if (!items) return null;
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      images: item.images,
      uri: item.uri,
      type: item.type,
      ownerDisplayName: item.owner.display_name,
    }));
  }

  function mappedTracksData(tracks?: ITrack[]): ITrack[] | null {
    if (!tracks) return null;
    return tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artists:
        track?.artists?.map((artist) => {
          return {
            name: artist.name,
            id: artist.id,
            type: artist.type,
            uri: artist.uri,
          };
        }) ?? [],
      album: track.album,
      duration_ms: track.duration_ms,
      uri: track.uri,
      explicit: track.explicit,
      is_playable: !!track.is_playable,
      preview_url: track.preview_url,
      type: track.type,
      is_local: track.is_local,
    }));
  }

  return {
    props: {
      user: user ?? null,
      accessToken: accessToken ?? null,
      featuredPlaylists:
        mappedFeaturedPlaylists(fullFilledValue(featuredPlaylists)) ?? null,
      newReleases: fullFilledValue(newReleases),
      categories: fullFilledValue(categories),
      topTracks:
        deserialize(mappedTracksData(fullFilledValue(topTracks)?.items)) ?? [],
      topArtists: fullFilledValue(topArtists),
      artistOfTheWeek: artistResult,
      tracksOfTheWeek: deserialize(mappedTracksData(tracksResult)) ?? [],
      thisPlaylists: deserialize(mappedPlaylistData(thisPlaylistsResult)) ?? [],
      tracksRecommendations:
        deserialize(mappedTracksData(tracksRecommendations)) ?? [],
      tracksInLibrary,
      translations,
    },
  };
}
