import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement, useState } from "react";
import PresentationCard from "components/PresentationCard";
import useAuth from "hooks/useAuth";
import { getAllMyShows } from "utils/getAllMyShows";
import useSpotify from "hooks/useSpotify";
import { CardType } from "components/CardContent";
import NavigationTopBarExtraField from "components/NavigationTopBarExtraField";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import Grid from "components/Grid";

export default function CollectionPlaylists(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { accessToken } = useAuth();
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
    if (!accessToken) return;

    async function getShows() {
      const allShows = await getAllMyShows(accessToken as string);
      if (!allShows) return;
      setShows(allShows.items);
    }
    getShows();
  }, [accessToken, setShows]);

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
