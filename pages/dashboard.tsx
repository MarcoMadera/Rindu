import { ReactElement, useEffect, useState } from "react";

import { decode } from "html-entities";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
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
import {
  useAuth,
  useHeader,
  useOnSmallScreen,
  useSpotify,
  useTranslations,
} from "hooks";
import { AuthorizationResponse, ITrack } from "types/spotify";
import { ITranslations } from "types/translations";
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
  makeCookie,
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
  featuredPlaylists: FeaturedPlaylistsMapped | null;
  newReleases: SpotifyApi.ListOfNewReleasesResponse | null;
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  topTracks: ITrack[] | null;
  topArtists: SpotifyApi.UsersTopArtistsResponse | null;
  tracksRecommendations: ITrack[] | null;
  tracksInLibrary: boolean[] | null;
  translations: ITranslations;
  artistOfTheWeek: SpotifyApi.ArtistObjectFull[] | null;
  tracksOfTheWeek: ITrack[] | null;
  thisPlaylists: MappedPlaylist[] | null;
  topTracksCards: ReturnType<typeof getTopTracksCards>;
}

const Dashboard = ({
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
  topTracksCards,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement => {
  const { user } = useAuth();
  const { setHeaderColor } = useHeader({
    showOnFixed: true,
    alwaysDisplayColor: false,
  });
  const { translations } = useTranslations();
  const router = useRouter();
  const { recentlyPlayed } = useSpotify();
  const isSmallScreen = useOnSmallScreen();
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
      }).then((tracks) => {
        if (Array.isArray(tracks)) setRecentListeningRecommendations(tracks);
      });
    }
  }, [recentlyPlayed, user, recentListeningRecommendations.length]);

  useEffect(() => {
    setHeaderColor("#242424");
  }, [router, setHeaderColor]);

  const cardsGap = isSmallScreen ? 8 : 24;

  return (
    <ContentContainer>
      {topTracks && topTracks.length > 0 ? (
        <TopTracks
          heading={translations.pages.dashboard.topTracksHeading}
          topTracks={topTracks}
        />
      ) : null}
      {featuredPlaylists?.playlists?.items &&
      featuredPlaylists?.playlists?.items?.length > 0 ? (
        <Carousel
          title={
            featuredPlaylists.message ??
            translations.pages.dashboard.featuredPlaylistsHeading
          }
          gap={cardsGap}
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
                  `${translations.pages.dashboard.by} ${ownerDisplayName ?? ""}`
                }
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      <Carousel
        title={translations.pages.dashboard.topTracksPlaylistHeading}
        gap={cardsGap}
      >
        {topTracksCards?.map((item) => {
          if (!item) return null;
          const { images, name, url } = item;
          return (
            <PresentationCard
              type={CardType.SIMPLE}
              key={name}
              images={images}
              title={name}
              id={name}
              subTitle={""}
              url={url}
            />
          );
        })}
      </Carousel>
      {artistOfTheWeek && artistOfTheWeek.length > 0 ? (
        <Carousel
          title={translations.pages.dashboard.artistOfTheWeekHeading}
          gap={cardsGap}
        >
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
          title={translations.pages.dashboard.tracksOfTheWeekHeading}
          tracksInLibrary={[]}
          tracksRecommendations={tracksOfTheWeek}
        />
      )}
      {recentlyPlayed && recentlyPlayed.length > 0 ? (
        <Carousel
          title={translations.pages.dashboard.recentlyListenedHeading}
          gap={cardsGap}
        >
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
          title={
            newReleases.message ??
            translations.pages.dashboard.newReleasesHeading
          }
          gap={cardsGap}
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
          title={translations.pages.dashboard.tracksRecommendationsHeading}
          tracksInLibrary={tracksInLibrary}
          tracksRecommendations={tracksRecommendations}
        />
      )}
      {thisPlaylists && thisPlaylists.length > 0 ? (
        <Carousel
          title={translations.pages.dashboard.thisPlaylistsHeading}
          gap={cardsGap}
        >
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
                  `${translations.pages.dashboard.by} ${ownerDisplayName ?? ""}`
                }
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      {recentListeningRecommendations.length > 0 ? (
        <Carousel
          title={
            translations.pages.dashboard.recentListeningRecommendationsHeading
          }
          gap={cardsGap}
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
        <Carousel
          title={translations.pages.dashboard.topArtistsHeading}
          gap={cardsGap}
        >
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
        <Carousel
          title={translations.pages.dashboard.categories}
          gap={cardsGap}
        >
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

export const getServerSideProps = (async (context) => {
  const translations = getTranslations(context);
  const lastFMAPIKey = process.env.LAST_FM_API_KEY as string;
  let tokens: Record<string, string | null> | AuthorizationResponse = {
    accessToken: takeCookie(ACCESS_TOKEN_COOKIE, context),
    refreshToken: takeCookie(REFRESH_TOKEN_COOKIE, context),
    expiresIn: takeCookie(EXPIRE_TOKEN_COOKIE, context),
  };

  if (context.query.code) {
    const authorization = await getAuthorizationByCode(
      context.query.code as string,
      context
    );

    if (authorization) {
      tokens = {
        accessToken: authorization.access_token,
        refreshToken: authorization.refresh_token,
        expiresIn: authorization.expires_in?.toString(),
      };
    }
    if (!tokens.accessToken) {
      serverRedirect(context.res, "/");
      return {
        props: {
          translations,
        },
      };
    }

    makeCookie({
      context,
      name: ACCESS_TOKEN_COOKIE,
      value: tokens.accessToken,
    });
    makeCookie({
      context,
      name: REFRESH_TOKEN_COOKIE,
      value: tokens.refreshToken ?? "",
    });
    makeCookie({
      context,
      name: EXPIRE_TOKEN_COOKIE,
      value: tokens.expiresIn ?? "",
    });
  }
  const { user } = (await getAuth(context)) ?? {};
  const topTracksCards = getTopTracksCards(user, translations);
  const artistsOfTheWeekProm = getArtistsOfTheWeek(lastFMAPIKey);
  const tracksOfTheWeekProm = getTracksOfTheWeek(lastFMAPIKey);

  const featuredPlaylistsProm = getFeaturedPlaylists(
    user?.country ?? "US",
    10,
    context
  );
  const newReleasesProm = getNewReleases(user?.country ?? "US", 10, context);

  const categoriesProm = getCategories(user?.country ?? "US", 30, context);
  const topTracksProm = getMyTop(TopType.TRACKS, 10, "short_term", context);
  const topTracksMediumProm = getMyTop(
    TopType.TRACKS,
    30,
    "medium_term",
    context
  );
  const topArtistsProm = getMyTop(TopType.ARTISTS, 20, "long_term", context);

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
    context,
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
  const artistNamesSearched = new Set<string>();

  if (artistsOfTheWeekSettled) {
    artistsOfTheWeekSettled.artists.artist.forEach((artist) => {
      if (artistNamesSearched.has(artist.name)) return;
      searchedArtistsPromises.push(searchArtist(artist.name, context));
      artistNamesSearched.add(artist.name);
    });
  }

  if (tracksOfTheWeekSettled) {
    tracksOfTheWeekSettled.tracks.track.forEach((track) => {
      searchedTracksPromises.push(
        searchTrack(
          `track:${track.name}${
            track?.artist?.name ? `%20artist:${track?.artist?.name}` : ""
          }`,
          10,
          context
        )
      );
    });
  }

  if (topTracksMediumSettled) {
    topTracksMediumSettled.items.forEach((track) => {
      searchedPlaylistsPromises.push(
        searchPlaylist(`This is ${track.artists[0].name}`, context)
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
      fullFilledItem[0]?.type === "artist"
    ) {
      const isDuplicate = artistResult.some(
        (artist) => artist.id === fullFilledItem[0]?.id
      );
      if (!isDuplicate) {
        artistResult.push(fullFilledItem[0]);
      }
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

    if (isValidTrack && fullFilledItem[0].type === "track") {
      tracksResult.push(fullFilledItem[0]);
      return;
    }

    if (
      fullFilledItem &&
      i > searchedArtistsPromisesLenght + searchedPlaylistsPromisesLength
    ) {
      const playlists = fullFilledItem.filter(
        (playlist) =>
          playlist.type === "playlist" &&
          playlist?.owner.display_name === "Spotify"
      );
      if (!playlists[0]) return;
      const isDuplicate = thisPlaylistsResult.some(
        (playlist) => playlist.id === playlists[0]?.id
      );
      if (!isDuplicate && "tracks" in playlists[0]) {
        thisPlaylistsResult.push(playlists[0]);
      }
    }
  });

  const recommendedTracksIds =
    tracksRecommendations?.map((item) => item.id) ?? [];

  const tracksInLibrary = await checkTracksInLibrary(
    recommendedTracksIds,
    context
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
      topTracksCards,
    },
  };
}) satisfies GetServerSideProps<Partial<DashboardProps>>;
