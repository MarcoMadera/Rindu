import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement, useState } from "react";
import Link from "next/link";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";

async function getShow(offset: number, accessToken: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/me/shows?limit=50&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await res.json();
  return data;
}

async function getAllAlbums(accessToken: string) {
  const limit = 50;
  const albumsData: SpotifyApi.UsersSavedShowsResponse = await getShow(
    0,
    accessToken
  );

  let restAlbumsData: SpotifyApi.UsersSavedShowsResponse | undefined;
  const max = Math.ceil(albumsData.total / limit);

  if (max <= 1) {
    return albumsData;
  }

  for (let i = 1; i < max; i++) {
    const resAlbumsData = await getShow(limit * i, accessToken);
    if (restAlbumsData) {
      restAlbumsData = {
        ...restAlbumsData,
        items: [...restAlbumsData.items, ...resAlbumsData.items],
      };
    } else {
      restAlbumsData = resAlbumsData;
    }
  }
  if (!restAlbumsData) {
    return albumsData;
  }
  const allPlaylists = {
    ...albumsData,
    items: [...albumsData.items, ...restAlbumsData.items],
  };
  return allPlaylists;
}

export default function CollectionPlaylists(): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { accessToken } = useAuth();
  const [shows, setShows] = useState<SpotifyApi.SavedShowObject[]>([]);

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
            a:nth-of-type(2) {
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

  useEffect(() => {
    if (!accessToken) return;

    async function getAlbums() {
      const allAlbums: SpotifyApi.UsersSavedShowsResponse = await getAllAlbums(
        accessToken as string
      );
      setShows(allAlbums.items);
    }
    getAlbums();
  }, [accessToken, setShows]);

  return (
    <main>
      <Head>
        <title>Rindu - Library</title>
      </Head>
      <h2>Podcasts</h2>
      <section>
        {shows?.length > 0
          ? shows.map(({ show }) => {
              return (
                <PresentationCard
                  type="show"
                  key={show.id}
                  images={show.images}
                  title={show.name}
                  subTitle={show.description}
                  id={show.id}
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
        }
      `}</style>
    </main>
  );
}
