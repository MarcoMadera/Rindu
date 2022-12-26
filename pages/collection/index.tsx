import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getTranslations, Page, Translations } from "utils/getTranslations";
import { serverRedirect } from "utils/serverRedirect";
import { NextApiResponse, NextApiRequest } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import NavigationTopBarExtraField from "components/NavigationTopBarExtraField";
import useHeader from "hooks/useHeader";

interface ICollectionProps {
  translations: Translations["collection"];
}

export default function Collection({
  translations,
}: ICollectionProps): ReactElement {
  const router = useRouter();
  const { setElement, setHeaderColor } = useHeader();
  useEffect(() => {
    router.push("/collection/playlists");
  }, [router]);

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField selected={1} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  return (
    <Head>
      <title>Rindu - {translations?.collection}</title>
    </Head>
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
