import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getTranslations, Page, Translations } from "utils/getTranslations";
import { serverRedirect } from "utils/serverRedirect";
import { NextApiResponse, NextApiRequest } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import NavigationTopBarExtraField from "components/NavigationTopBarExtraField";
import useHeader from "hooks/useHeader";
import useOnSmallScreen from "hooks/useOnSmallScreen";
import ContentContainer from "components/ContentContainer";

interface ICollectionProps {
  translations: Translations["collection"];
}

export default function Collection({
  translations,
}: ICollectionProps): ReactElement {
  const router = useRouter();
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
        <title>Rindu - {translations?.collection}</title>
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

export function getServerSideProps({
  res,
  req,
  query,
}: {
  res: NextApiResponse;
  req: NextApiRequest;
  query: NextParsedUrlQuery;
}): {
  props: ICollectionProps | null;
} {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.CollectionPodcasts);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }

  return {
    props: {
      translations,
    },
  };
}
