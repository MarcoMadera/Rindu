import { NextApiRequest, NextApiResponse, NextPage } from "next";
import React, { useEffect } from "react";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../utils/constants";
import useSpotify from "hooks/useSpotify";
import { decode } from "html-entities";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getAuthorizationByCode } from "utils/spotifyCalls/getAuthorizationByCode";

interface DashboardProps {
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | null;
}

const Dashboard: NextPage<DashboardProps> = ({ user }) => {
  const { setIsLogin, setUser } = useAuth();
  const { playlists } = useSpotify();

  useEffect(() => {
    setIsLogin(true);

    setUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <main>
        <header></header>
        <h1>Escoge una playlist</h1>
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
      </main>
      <style jsx>{`
        main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }
        h1 {
          color: #fff;
          font-weight: bold;
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
    </>
  );
};
export default Dashboard;

export async function getServerSideProps({
  res,
  req,
  query,
}: {
  res: NextApiResponse;
  req: NextApiRequest;
  query: { code?: string };
}): Promise<{
  props: DashboardProps;
}> {
  const cookies = req?.headers?.cookie ?? "";

  if (query.code) {
    const tokens = await getAuthorizationByCode(query.code);
    if (!tokens) {
      serverRedirect(res, "/");
    }
    if (tokens) {
      res.setHeader("Set-Cookie", [
        `${ACCESS_TOKEN_COOKIE}=${tokens.accessToken}; Path=/;"`,
        `${REFRESH_TOKEN_COOKIE}=${tokens.refreshToken}; Path=/;"`,
        `${EXPIRE_TOKEN_COOKIE}=${tokens.expiresIn}; Path=/;"`,
      ]);
    }
  }

  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  return {
    props: { user: user || null, accessToken: accessToken ?? null },
  };
}
