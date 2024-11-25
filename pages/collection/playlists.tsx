import { ReactElement, useEffect } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";

import {
  ContentContainer,
  Heading,
  NavigationTopBarExtraField,
} from "components";
import { PlaylistGridList } from "components/VirtualizedList/PlaylistGridList";
import { useAnalytics, useHeader, useSpotify, useTranslations } from "hooks";
import { ITranslations } from "types/translations";
import {
  getAuth,
  getTranslations,
  getValidCookieLocale,
  serverRedirect,
} from "utils";

interface CollectionPlaylistsProps {
  user: SpotifyApi.UserObjectPrivate | null;
  translations: ITranslations;
}

export default function CollectionPlaylists(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({
    showOnFixed: true,
    alwaysDisplayColor: true,
  });
  const { translations } = useTranslations();
  const { trackWithGoogleAnalytics } = useAnalytics();
  const { isPlaying } = useSpotify();
  const title = `Rindu - ${translations.pages.collectionPlaylists.title}`;

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField selected={1} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  useEffect(() => {
    trackWithGoogleAnalytics();
  }, [trackWithGoogleAnalytics]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <Heading number={3} as="h2">
        Playlists
      </Heading>
      <PlaylistGridList translations={translations} />
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

  return {
    props: {
      user: user ?? null,
      translations,
      locale: getValidCookieLocale(context),
    },
  };
}) satisfies GetServerSideProps<Partial<CollectionPlaylistsProps>>;
