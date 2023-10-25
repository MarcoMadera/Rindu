import { ReactElement, useEffect } from "react";

import { decode } from "html-entities";
import { NextApiRequest, NextApiResponse } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Head from "next/head";

import {
  ContentContainer,
  Grid,
  Heading,
  LikedSongsCard,
  NavigationTopBarExtraField,
  PresentationCard,
} from "components";
import { CardType } from "components/CardContent";
import {
  useAnalytics,
  useHeader,
  useSpotify,
  useTranslations,
  useUserPlaylists,
} from "hooks";
import {
  getAuth,
  getTranslations,
  Page,
  serverRedirect,
  Translations,
} from "utils";

interface CollectionPlaylistsProps {
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Translations["collectionPlaylists"];
}

export default function CollectionPlaylists(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({
    showOnFixed: true,
    alwaysDisplayColor: true,
  });
  const { translations } = useTranslations();
  const { trackWithGoogleAnalytics } = useAnalytics();
  const { isPlaying } = useSpotify();
  const playlists = useUserPlaylists();

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
          <title>Rindu - {translations.title}</title>
        </Head>
      )}
      <Heading number={3} as="h2">
        Playlists
      </Heading>
      <Grid>
        <LikedSongsCard />
        {playlists?.length > 0
          ? playlists.map(({ images, name, description, id, owner }) => {
              return (
                <PresentationCard
                  type={CardType.PLAYLIST}
                  key={id}
                  images={images}
                  title={name}
                  subTitle={
                    decode(description) ||
                    `${translations.by} ${owner.display_name || owner.id}`
                  }
                  id={id}
                />
              );
            })
          : null}
      </Grid>
    </ContentContainer>
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
  props: CollectionPlaylistsProps | null;
}> {
  const country = (query.country ?? "US") as string;
  const translations = getTranslations(country, Page.CollectionPlaylists);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }

  const { accessToken, user } = (await getAuth(res, cookies)) ?? {};

  return {
    props: {
      user: user ?? null,
      accessToken: accessToken ?? null,
      translations,
    },
  };
}
