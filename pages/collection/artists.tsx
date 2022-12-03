import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement, useState } from "react";
import PresentationCard from "components/PresentationCard";
import useAuth from "hooks/useAuth";
import { getMyArtists } from "utils/spotifyCalls/getMyArtists";
import useSpotify from "hooks/useSpotify";
import { CardType } from "components/CardContent";
import NavigationTopBarExtraField from "components/NavigationTopBarExtraField";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import Grid from "components/Grid";
import { NextApiResponse, NextApiRequest } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getAuth } from "utils/getAuth";
import { getTranslations, Page, Translations } from "utils/getTranslations";
import { serverRedirect } from "utils/serverRedirect";
import useAnalytics from "hooks/useAnalytics";

interface CollectionArtistProps {
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Translations["collectionArtists"];
}

export default function CollectionPlaylists({
  accessToken,
  user,
  translations,
}: CollectionArtistProps): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { setUser, setAccessToken } = useAuth();
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
    if (!accessToken) return;

    async function getArtists() {
      const artistsObjResponse = await getMyArtists(accessToken as string);
      if (artistsObjResponse?.artists.items) {
        setArtists(artistsObjResponse?.artists.items);
      }
    }
    getArtists();
  }, [accessToken, setArtists]);

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
        {translations.artists}
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
                  subTitle={translations.artist}
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
  props: CollectionArtistProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.CollectionArtists);
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
