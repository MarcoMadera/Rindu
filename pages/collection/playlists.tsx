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

export default function CollectionPlaylists(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { playlists, isPlaying } = useSpotify();

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField selected={1} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

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
