import { ReactElement, useEffect, useState } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";

import {
  ContentContainer,
  Grid,
  Heading,
  NavigationTopBarExtraField,
  PresentationCard,
} from "components";
import { CardType } from "components/CardContent";
import { useAnalytics, useHeader, useSpotify } from "hooks";
import {
  getAllMyShows,
  getAuth,
  getTranslations,
  Page,
  serverRedirect,
} from "utils";

interface CollectionPodcastsProps {
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

export default function CollectionPlaylists(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { trackWithGoogleAnalytics } = useAnalytics();
  const [shows, setShows] = useState<SpotifyApi.SavedShowObject[]>([]);
  const { isPlaying } = useSpotify();

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField selected={2} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  useEffect(() => {
    async function getShows() {
      const allShows = await getAllMyShows();
      if (!allShows) return;
      setShows(allShows.items);
    }
    getShows();
  }, [setShows]);

  useEffect(() => {
    trackWithGoogleAnalytics();
  }, [trackWithGoogleAnalytics]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - Library</title>
        </Head>
      )}
      <Heading number={3} as="h2">
        Podcasts
      </Heading>
      <Grid>
        {shows?.length > 0
          ? shows.map(({ show }) => {
              return (
                <PresentationCard
                  type={CardType.SHOW}
                  key={show.id}
                  images={show.images}
                  title={show.name}
                  subTitle={show.description}
                  id={show.id}
                />
              );
            })
          : null}
      </Grid>
    </ContentContainer>
  );
}

export const getServerSideProps = (async (context) => {
  const country = (context.query.country ?? "US") as string;
  const translations = getTranslations(country, Page.CollectionPodcasts);
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
    },
  };
}) satisfies GetServerSideProps<Partial<CollectionPodcastsProps>>;
