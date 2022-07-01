import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement } from "react";
import Link from "next/link";
import useSpotify from "hooks/useSpotify";
import PresentationCard from "components/PresentationCard";
import { decode } from "html-entities";
export default function CollectionPlaylists(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { playlists, isPlaying } = useSpotify();

  useEffect(() => {
    setElement(() => {
      return (
        <div>
          <Link href="/collection/playlists">
            <a>Playlists</a>
          </Link>
          <Link href="/collection/podcasts">
            <a>Podcasts</a>
          </Link>
          <Link href="/collection/artists">
            <a>Artists</a>
          </Link>
          <Link href="/collection/albums">
            <a>Albums</a>
          </Link>
          <style jsx>{`
            div {
              display: flex;
              column-gap: 8px;
              margin-left: 24px;
            }
            a {
              padding: 12px 18px;
              color: white;
              text-decoration: none;
              font-weight: 800;
              font-size: 13px;
              border-radius: 4px;
            }
            a:nth-of-type(1) {
              background-color: #343434;
            }
          `}</style>
        </div>
      );
    });

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  return (
    <main>
      {!isPlaying && (
        <Head>
          <title>Rindu - Library</title>
        </Head>
      )}
      <h2>Playlists</h2>
      <section>
        {playlists?.length > 0
          ? playlists.map(({ images, name, description, id, owner }) => {
              return (
                <PresentationCard
                  type="playlist"
                  key={id}
                  images={images}
                  title={name}
                  subTitle={decode(description) || `De ${owner.display_name}`}
                  id={id}
                />
              );
            })
          : null}
      </section>
      <style jsx>{`
        main {
          display: block;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
          margin: 0 auto;
          padding: 0 20px;
        }
        @media (max-width: 1000px) {
          main {
            width: 100vw;
          }
        }
        h2 {
          color: #fff;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 28px;
          text-transform: none;
          margin: 0;
        }
        section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-gap: 24px;
          margin: 20px 0 50px 0;
          justify-content: space-between;
          padding-bottom: 50px;
        }
      `}</style>
    </main>
  );
}
