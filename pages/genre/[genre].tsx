import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getCategoryPlaylists } from "utils/spotifyCalls/getCategoryPlaylists";
import useHeader from "hooks/useHeader";
import { getSingleCategoryInfo } from "utils/spotifyCalls/getSingleCategoryInfo";

interface CategoryProps {
  categoryInfo: SpotifyApi.SingleCategoryResponse | null;
  playlists: SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified> | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
}

export default function Category({
  categoryInfo,
  playlists,
  accessToken,
  user,
}: CategoryProps): ReactElement {
  const { setAccessToken, setUser } = useAuth();
  const { setHeaderColor } = useHeader();
  useEffect(() => {
    setHeaderColor("#242424");
  }, [setHeaderColor]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      setUser(user);
    }
  }, [accessToken, setAccessToken, setUser, user]);

  return (
    <main>
      <Head>
        <title>Rindu - Search</title>
      </Head>
      {categoryInfo && <h1>{categoryInfo?.name}</h1>}
      {playlists && playlists?.items?.length > 0 ? (
        <section>
          {playlists?.items?.map(({ images, name, description, id }) => {
            return (
              <PresentationCard
                key={id}
                type="playlist"
                images={images}
                title={name}
                subTitle={description ?? ""}
                id={id}
              />
            );
          })}
        </section>
      ) : (
        <p>This section is empty</p>
      )}
      <style jsx>{`
        main {
          display: block;
          margin: 0 auto;
          min-height: calc(100vh - 90px);
          width: calc(100vw - 245px);
          max-width: 1955px;
          padding: 40px 32px;
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
          justify-content: space-between;
        }
        h1 {
          padding: 0;
          margin-top: -20px;
          visibility: visible;
          width: 100%;
          font-size: 96px;
          line-height: 96px;
          font-weight: 900;
          color: #fff;
        }
      `}</style>
    </main>
  );
}

export async function getServerSideProps({
  params: { genre },
  req,
  res,
}: {
  params: { genre: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: CategoryProps | null;
}> {
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const categoryInfoProm = getSingleCategoryInfo(genre, accessToken, cookies);

  const categoriesProm = getCategoryPlaylists(
    genre,
    user?.country,
    accessToken,
    cookies
  );

  const [categoryInfo, categories] = await Promise.allSettled([
    categoryInfoProm,
    categoriesProm,
  ]);

  return {
    props: {
      categoryInfo:
        categoryInfo.status === "fulfilled" ? categoryInfo.value ?? null : null,
      playlists:
        categories.status === "fulfilled"
          ? categories.value?.playlists ?? null
          : null,
      accessToken: accessToken ?? null,
      user: user ?? null,
    },
  };
}
