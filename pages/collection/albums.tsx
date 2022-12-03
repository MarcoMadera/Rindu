import Head from "next/head";
import useHeader from "hooks/useHeader";
import useAuth from "hooks/useAuth";
import { useEffect, ReactElement, useState } from "react";
import PresentationCard from "components/PresentationCard";
import { getYear } from "utils/getYear";
import { getAllAlbums } from "utils/getAllAlbums";
import useSpotify from "hooks/useSpotify";
import { CardType } from "components/CardContent";
import NavigationTopBarExtraField from "components/NavigationTopBarExtraField";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import Grid from "components/Grid";
import { NextApiRequest, NextApiResponse } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getTranslations, Page, Translations } from "utils/getTranslations";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import useAnalytics from "hooks/useAnalytics";

interface CollectionAlbumProps {
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Translations["collectionAlbums"];
}

export default function CollectionAlbums({
  accessToken,
  user,
  translations,
}: CollectionAlbumProps): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { setUser, setAccessToken } = useAuth();
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
    if (!accessToken) return;

    async function getAlbums() {
      const allAlbums = await getAllAlbums(accessToken as string);
      if (!allAlbums) return;
      setAlbums(allAlbums.items);
    }
    getAlbums();
  }, [accessToken, setAlbums]);

  useEffect(() => {
    trackWithGoogleAnalytics();

    accessToken && setAccessToken(accessToken);

    setUser(user);
  }, [accessToken, setAccessToken, setUser, trackWithGoogleAnalytics, user]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - {translations.title}</title>
        </Head>
      )}
      <Heading number={3} as="h2">
        {translations.albums}
      </Heading>
      <Grid>
        {albums?.length > 0
          ? albums.map(({ album }) => {
              const artistNames = album?.artists?.map((artist) => artist.name);
              const subTitle = album?.release_date
                ? `${getYear(album.release_date)} · ${translations.album}`
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

export async function getServerSideProps({
  res,
  req,
  query,
}: {
  res: NextApiResponse;
  req: NextApiRequest;
  query: NextParsedUrlQuery;
}): Promise<{
  props: CollectionAlbumProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.CollectionAlbums);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }

  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  return {
    props: {
      user: user || null,
      accessToken: accessToken ?? null,
      translations,
    },
  };
}
