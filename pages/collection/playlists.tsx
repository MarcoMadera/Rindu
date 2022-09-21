import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement } from "react";
import useSpotify from "hooks/useSpotify";
import PresentationCard from "components/PresentationCard";
import { decode } from "html-entities";
import { CardType } from "components/CardContent";
import NavigationTopBarExtraField from "components/NavigationTopBarExtraField";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import Grid from "components/Grid";
import { NextApiResponse, NextApiRequest } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getAuth } from "utils/getAuth";
import { getTranslations, Page } from "utils/getTranslations";
import { serverRedirect } from "utils/serverRedirect";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { getCurrentUserPlaylists } from "utils/getAllMyPlaylists";

interface CollectionPlaylistsrops {
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

export default function CollectionPlaylists({
  accessToken,
  user,
}: CollectionPlaylistsrops): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const { playlists, setPlaylists, isPlaying } = useSpotify();

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField selected={1} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  useEffect(() => {
    trackWithGoogleAnalitycs();

    accessToken && setAccessToken(accessToken);

    setUser(user);
  }, [accessToken, setAccessToken, setUser, trackWithGoogleAnalitycs, user]);

  useEffect(() => {
    if (!playlists) {
      getCurrentUserPlaylists(accessToken as string).then((playlists) => {
        if (playlists) {
          setPlaylists(playlists.items);
        }
      });
    }
  }, [accessToken, playlists, setPlaylists]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - Library</title>
        </Head>
      )}
      <Heading number={3} as="h2">
        Playlists
      </Heading>
      <Grid>
        {playlists?.length > 0
          ? playlists.map(({ images, name, description, id, owner }) => {
              return (
                <PresentationCard
                  type={CardType.PLAYLIST}
                  key={id}
                  images={images}
                  title={name}
                  subTitle={decode(description) || `De ${owner.display_name}`}
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
  props: CollectionPlaylistsrops | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.CollectionPlaylists);
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
