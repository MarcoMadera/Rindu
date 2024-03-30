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
  getAllAlbums,
  getAuth,
  getTranslations,
  getYear,
  serverRedirect,
} from "utils";

interface CollectionAlbumProps {
  user: SpotifyApi.UserObjectPrivate | null;
  translations: ITranslations;
}
export default function CollectionAlbums(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { translations } = useTranslations();
  const [albums, setAlbums] = useState<SpotifyApi.SavedAlbumObject[]>([]);
  const { isPlaying } = useSpotify();
  const { trackWithGoogleAnalytics } = useAnalytics();

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField selected={4} />);

    return () => {
      setElement(null);
    };
  }, [setElement]);

  setHeaderColor("#242424");

  useEffect(() => {
    async function getAlbums() {
      const allAlbums = await getAllAlbums();
      if (!allAlbums) return;
      setAlbums(allAlbums.items);
    }
    getAlbums();
  }, [setAlbums]);

  useEffect(() => {
    trackWithGoogleAnalytics();
  }, [trackWithGoogleAnalytics]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - {translations.pages.collectionAlbums.title}</title>
        </Head>
      )}
      <Heading number={3} as="h2">
        {translations.pages.collectionAlbums.albums}
      </Heading>
      <Grid>
        {albums?.length > 0
          ? albums.map(({ album }) => {
              const artistNames = album?.artists?.map((artist) => artist.name);
              const subTitle = album?.release_date
                ? `${getYear(album.release_date)} · ${translations.pages.collectionAlbums.album}`
                : artistNames.join(", ");
              return (
                <PresentationCard
                  type={CardType.ALBUM}
                  key={album?.id}
                  images={album?.images}
                  title={album?.name}
                  subTitle={subTitle}
                  id={album?.id}
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
    },
  };
}) satisfies GetServerSideProps<Partial<CollectionAlbumProps>>;
