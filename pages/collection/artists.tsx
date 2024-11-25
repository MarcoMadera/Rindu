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
import { useAnalytics, useHeader, useSpotify, useTranslations } from "hooks";
import { ITranslations } from "types/translations";
import {
  getAuth,
  getTranslations,
  getValidCookieLocale,
  serverRedirect,
} from "utils";
import { getMyArtists } from "utils/spotifyCalls";

interface CollectionArtistProps {
  user: SpotifyApi.UserObjectPrivate | null;
  translations: ITranslations;
}

export default function CollectionPlaylists(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { translations } = useTranslations();
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const { isPlaying } = useSpotify();
  const { trackWithGoogleAnalytics } = useAnalytics();

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField selected={3} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  useEffect(() => {
    async function getArtists() {
      const artistsObjResponse = await getMyArtists();
      if (artistsObjResponse?.artists.items) {
        setArtists(artistsObjResponse?.artists.items);
      }
    }
    getArtists();
  }, [setArtists]);

  useEffect(() => {
    trackWithGoogleAnalytics();
  }, [trackWithGoogleAnalytics]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - {translations.pages.collectionArtists.title}</title>
        </Head>
      )}
      <Heading number={3} as="h2">
        {translations.pages.collectionArtists.artists}
      </Heading>
      <Grid>
        {artists?.length > 0
          ? artists.map(({ id, images, name }) => {
              return (
                <PresentationCard
                  type={CardType.ARTIST}
                  key={id}
                  images={images}
                  title={name}
                  subTitle={translations.pages.collectionArtists.artist}
                  id={id}
                />
              );
            })
          : null}
      </Grid>
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
}) satisfies GetServerSideProps<Partial<CollectionArtistProps>>;
