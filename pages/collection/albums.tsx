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

export default function CollectionAlbums(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { accessToken } = useAuth();
  const [albums, setAlbums] = useState<SpotifyApi.SavedAlbumObject[]>([]);
  const { isPlaying } = useSpotify();

  useEffect(() => {
    setElement(() => <NavigationTopBarExtraField />);

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

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - Library</title>
        </Head>
      )}
      <Heading number={3} as="h2">
        Albums
      </Heading>
      <section>
        {albums?.length > 0
          ? albums.map(({ album }) => {
              const artistNames = album?.artists?.map((artist) => artist.name);
              const subTitle = album?.release_date
                ? `${getYear(album.release_date)} · Album`
                : artistNames.join(", ");
              return (
                <PresentationCard
                  type={CardType.ALBUM}
                  key={album.id}
                  images={album.images}
                  title={album.name}
                  subTitle={subTitle}
                  id={album.id}
                />
              );
            })
          : null}
      </section>
      <style jsx>{`
        main {
          display: block;
          min-height: calc(100vh - 90px);
          width: calc(100vw - 245px);
          margin: 0 auto;
          padding: 0px 30px;
        }
        @media (max-width: 1000px) {
          main {
            width: 100vw;
          }
        }
        section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-gap: 24px;
          margin: 20px 0 50px 0;
          justify-content: space-between;
        }
        :global(.extraField-nav li:nth-of-type(4) a) {
          background-color: #343434;
        }
      `}</style>
    </ContentContainer>
  );
}
