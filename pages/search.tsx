import { ReactElement, useEffect, useState } from "react";

import { decode } from "html-entities";
import { NextApiRequest, NextApiResponse } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Head from "next/head";

import {
  BrowseCategories,
  Carousel,
  ContentContainer,
  Heading,
  MainTracks,
  PresentationCard,
  SearchInputElement,
} from "components";
import { CardType } from "components/CardContent";
import {
  useAuth,
  useHeader,
  useOnSmallScreen,
  useSpotify,
  useTranslations,
} from "hooks";
import { getAuth, getTranslations, getYear, Page, serverRedirect } from "utils";
import { getCategories } from "utils/spotifyCalls";

interface SearchPageProps {
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

export default function SearchPage({
  categories,
  accessToken,
  user,
}: SearchPageProps): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { setUser, setAccessToken } = useAuth();
  const [data, setData] = useState<SpotifyApi.SearchResponse | null>(null);
  const { isPlaying } = useSpotify();
  const { translations } = useTranslations();
  const isSmallScreen = useOnSmallScreen();

  useEffect(() => {
    setElement(() => <SearchInputElement source="search" setData={setData} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
    setUser(user);
  }, [user, accessToken, setUser, setAccessToken]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - {translations.search}</title>
        </Head>
      )}
      {isSmallScreen && (
        <div className="search-container">
          <SearchInputElement source="search" setData={setData} />
          <style jsx>{`
            .search-container {
              margin: 30px auto;
              display: flex;
              justify-content: center;
              width: 100%;
            }
          `}</style>
        </div>
      )}
      {data ? (
        <div>
          {data.tracks?.items && data.tracks?.items?.length > 0 ? (
            <>
              <MainTracks
                title={translations.songs}
                tracksRecommendations={data.tracks?.items.slice(0, 5)}
              />
              <Carousel gap={24}>
                {data.tracks?.items.slice(5)?.map((track) => {
                  if (!track) return null;
                  return (
                    <PresentationCard
                      type={CardType.TRACK}
                      key={track.id}
                      track={track}
                      images={track.album.images}
                      title={track.name}
                      subTitle={track.artists[0].name}
                      id={track.id}
                      isSingle
                    />
                  );
                })}
              </Carousel>
            </>
          ) : null}
          {data.playlists?.items && data.playlists?.items?.length > 0 ? (
            <Carousel title={translations.playlists} gap={24}>
              {data.playlists?.items?.map((item) => {
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
                      `${translations.by} ${owner.display_name || ""}`
                    }
                    id={id}
                  />
                );
              })}
            </Carousel>
          ) : null}
          {data.artists?.items && data.artists?.items?.length > 0 ? (
            <Carousel title={translations.artists} gap={24}>
              {data.artists?.items?.map((item) => {
                if (!item) return null;
                const { images, name, id } = item;
                return (
                  <PresentationCard
                    type={CardType.ARTIST}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={translations.artist}
                    id={id}
                  />
                );
              })}
            </Carousel>
          ) : null}
          {data.albums?.items && data.albums?.items?.length > 0 ? (
            <Carousel title={translations.albums} gap={24}>
              {data.albums?.items?.map((item) => {
                if (!item) return null;
                const { images, name, id, artists, release_date } = item;
                const artistNames = artists.map((artist) => artist.name);
                const subTitle = release_date
                  ? `${getYear(release_date)} · ${translations.album}`
                  : artistNames.join(", ");
                return (
                  <PresentationCard
                    type={CardType.ALBUM}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={subTitle}
                    id={id}
                  />
                );
              })}
            </Carousel>
          ) : null}
          {data.shows?.items && data.shows?.items?.length > 0 ? (
            <Carousel title={translations.shows} gap={24}>
              {data.shows?.items?.map((item) => {
                if (!item) return null;
                const { images, name, id, publisher } = item;
                return (
                  <PresentationCard
                    type={CardType.SHOW}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={publisher}
                    id={id}
                  />
                );
              })}
            </Carousel>
          ) : null}
          {data.episodes?.items && data.episodes?.items?.length > 0 ? (
            <Carousel title={translations.episodes} gap={24}>
              {(
                data.episodes as SpotifyApi.PagingObject<SpotifyApi.EpisodeObject>
              )?.items?.map((item) => {
                if (!item) return null;
                const { images, name, id, description } = item;
                return (
                  <PresentationCard
                    type={CardType.EPISODE}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={description}
                    id={id}
                    isSingle
                  />
                );
              })}
            </Carousel>
          ) : null}
        </div>
      ) : (
        <>
          <Heading number={3} as="h1">
            {translations.browseAll}
          </Heading>
          <BrowseCategories categories={categories} />
        </>
      )}
    </ContentContainer>
  );
}

export async function getServerSideProps({
  req,
  res,
  query,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: SearchPageProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Search);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const categories = await getCategories(
    user?.country ?? "US",
    50,
    accessToken,
    cookies
  );

  return {
    props: {
      categories,
      accessToken: accessToken ?? null,
      user: user ?? null,
      translations,
    },
  };
}
