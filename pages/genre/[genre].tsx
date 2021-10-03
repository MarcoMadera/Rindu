import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { takeCookie } from "utils/cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { refreshAccessTokenRequest } from "lib/requests";
import { ACCESSTOKENCOOKIE, REFRESHTOKENCOOKIE } from "utils/constants";
import { validateAccessToken } from "utils/validateAccessToken";
import Router from "next/router";
import { SpotifyUserResponse } from "types/spotify";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";

async function getCategoryPlaylists(
  category: string,
  country?: string,
  accessToken?: string
) {
  const res = await fetch(
    `https://api.spotify.com/v1/browse/categories/${category}/playlists?limit=50&country=${
      country ?? "MX"
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
        }`,
      },
    }
  );
  const data = await res.json();
  return data.playlists;
}

interface CategoryProps {
  playlists: SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified>;
  accessToken: string | null;
  user: SpotifyUserResponse | null;
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
        {playlists?.items?.length > 0 ? (
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
  props: CategoryProps;
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const refreshToken = takeCookie(REFRESHTOKENCOOKIE, cookies);
  let accessToken = takeCookie(ACCESSTOKENCOOKIE, cookies);
  const user = await validateAccessToken(accessToken);

  try {
    if (refreshToken && !user) {
      const re = await refreshAccessTokenRequest(refreshToken);
      if (!re.ok) {
        res.writeHead(307, { Location: "/" });
        res.end();
      }
      const refresh = await re.json();
      accessToken = refresh.accessToken;
    } else {
      accessToken = cookies
        ? takeCookie(ACCESSTOKENCOOKIE, cookies)
        : undefined;
    }

    if (!cookies) {
      res.writeHead(307, { Location: "/" });
      res.end();
    }
  } catch (error) {
    console.log(error);
  }

  if (!user) {
    if (res) {
      res.writeHead(307, { Location: "/" });
      res.end();
    } else {
      Router.replace("/");
    }
  }

  const playlists = await getCategoryPlaylists(
    genre,
    user?.country,
    accessToken
  );
  return {
    props: {
      playlists: playlists ?? null,
      accessToken: accessToken ?? null,
      user: user ?? null,
    },
  };
}
