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
import { getAuth, getTranslations, Page, serverRedirect } from "utils";
import { getCategories } from "utils/spotifyCalls";

interface SearchPageProps {
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
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
          <title>Rindu - {translations.search}</title>
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
        <>
          <Heading number={3} as="h1">
            {translations.browseAll}
          </Heading>
          {categories ? <BrowseCategories categories={categories} /> : null}
        </>
      )}
    </ContentContainer>
  );
}

export const getServerSideProps = (async (context) => {
  const country = (context.query.country ?? "US") as string;
  const translations = getTranslations(country, Page.Search);
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
    },
  };
}) satisfies GetServerSideProps<Partial<SearchPageProps>>;
