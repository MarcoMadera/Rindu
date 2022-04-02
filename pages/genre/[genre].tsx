import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getCategoryPlaylists } from "utils/spotifyCalls/getCategoryPlaylists";

interface CategoryProps {
  playlists: SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified> | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
}

export default function Category({
  playlists,
  accessToken,
  user,
}: CategoryProps): ReactElement {
  const { setAccessToken, setUser } = useAuth();

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
      <section>
        {playlists && playlists?.items?.length > 0 ? (
          playlists?.items?.map(({ images, name, description, id }) => {
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
          })
        ) : (
          <h1>This section is empty</h1>
        )}
      </section>
      <style jsx>{`
        main {
          display: block;
          margin: 0 auto;
          min-height: calc(100vh - 90px);
          width: calc(100vw - 245px);
          max-width: 1955px;
          padding: 40px 32px;
        }
        section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-gap: 24px;
          justify-content: space-between;
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

  const playlists = await getCategoryPlaylists(
    genre,
    user?.country,
    accessToken,
    cookies
  );
  return {
    props: {
      playlists: playlists,
      accessToken: accessToken ?? null,
      user: user ?? null,
    },
  };
}
