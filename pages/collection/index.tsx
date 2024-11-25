import { ReactElement, useEffect } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { ContentContainer, NavigationTopBarExtraField } from "components";
import { useHeader, useOnSmallScreen, useTranslations } from "hooks";
import { ITranslations } from "types/translations";
import {
  getAuth,
  getTranslations,
  getValidCookieLocale,
  serverRedirect,
} from "utils";

interface ICollectionProps {
  translations: ITranslations;
  user: SpotifyApi.UserObjectPrivate | null;
}

export default function Collection(): ReactElement {
  const router = useRouter();
  const { translations } = useTranslations();
  const { setElement, setHeaderColor } = useHeader();

  const isSmallScreen = useOnSmallScreen();

  useEffect(() => {
    if (isSmallScreen || window.innerWidth < 768) return;
    router.push("/collection/playlists");
  }, [router, isSmallScreen]);

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField selected={1} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  return (
    <ContentContainer>
      <Head>
        <title>Rindu - {translations.pages.collection.title}</title>
      </Head>
      <div className="navigation-container">
        <NavigationTopBarExtraField selected={0} />
        <style jsx>{`
          .navigation-container {
            display: none;
          }

          @media screen and (max-width: 768px) {
            .navigation-container {
              display: block;
              position: relative;
            }

            .navigation-container :global(.extraField-nav) {
              margin-left: 0;
              display: block;
              position: relative;
            }
            .navigation-container :global(.extraField-nav ul) {
              flex-direction: column;
              align-items: flex-start;
              gap: 2rem;
              justify-content: center;
              align-items: baseline;
              margin: 16px 0;
            }
          }
        `}</style>
      </div>
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
      translations,
      locale: getValidCookieLocale(context),
      user: user ?? null,
    },
  };
}) satisfies GetServerSideProps<Partial<ICollectionProps>>;
