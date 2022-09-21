import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getTranslations, Page } from "utils/getTranslations";
import { serverRedirect } from "utils/serverRedirect";
import { NextApiResponse, NextApiRequest } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

export default function Collection(): ReactElement {
  const router = useRouter();
  useEffect(() => {
    router.push("/collection/playlists");
  }, [router]);
  return (
    <Head>
      <title>Rindu - Library</title>
    </Head>
  );
}

export async function getServerSideProps({
  res,
  req,
  query,
}: {
  res: NextApiResponse;
  req: NextApiRequest;
  query: NextParsedUrlQuery;
}): Promise<{
  props: { translations: Record<string, string> } | null;
}> {
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
