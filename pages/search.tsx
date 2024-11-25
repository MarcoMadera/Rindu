import { ReactElement, useEffect, useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import {
  BrowseCategories,
  ContentContainer,
  Heading,
  SearchInputElement,
  SearchResults,
} from "components";
import {
  useHeader,
  useOnSmallScreen,
  useSpotify,
  useTranslations,
} from "hooks";
import { ITranslations } from "types/translations";
import {
  getAuth,
  getTranslations,
  getValidCookieLocale,
  serverRedirect,
} from "utils";
import { getCategories } from "utils/spotifyCalls";

interface SearchPageProps {
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: ITranslations;
}

export default function SearchPage({
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const [searchResponse, setSearchResponse] =
    useState<SpotifyApi.SearchResponse | null>(null);
  const { isPlaying } = useSpotify();
  const { translations } = useTranslations();
  const isSmallScreen = useOnSmallScreen();

  useEffect(() => {
    setElement(() => (
      <SearchInputElement source="search" setData={setSearchResponse} />
    ));

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - {translations.pages.search.search}</title>
        </Head>
      )}
      {isSmallScreen && (
        <div className="search-container">
          <SearchInputElement source="search" setData={setSearchResponse} />
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
      {searchResponse ? (
        <SearchResults searchResponse={searchResponse} />
      ) : (
        <div>
          <Heading number={3} as="h1">
            {translations.pages.search.browseAll}
          </Heading>
          {categories ? <BrowseCategories categories={categories} /> : null}
          <style jsx>{`
            @media (max-width: 768px) {
              div :global(h1) {
                padding: 0 8px;
              }
            }
          `}</style>
        </div>
      )}
    </ContentContainer>
  );
}

export const getServerSideProps = (async (context) => {
  const translations = getTranslations(context);
  const cookies = context.req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const { user } = (await getAuth(context)) ?? {};
  const categories = await getCategories(user?.country ?? "US", 50, context);

  return {
    props: {
      categories: categories ?? null,
      user: user ?? null,
      translations,
      locale: getValidCookieLocale(context),
    },
  };
}) satisfies GetServerSideProps<Partial<SearchPageProps>>;
