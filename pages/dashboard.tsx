import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Router from "next/router";
import React, { useEffect } from "react";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";
import {
  getAuthorizationByCode,
  refreshAccessTokenRequest,
} from "lib/requests";
import { SpotifyUserResponse } from "types/spotify";
import {
  ACCESSTOKENCOOKIE,
  EXPIRETOKENCOOKIE,
  REFRESHTOKENCOOKIE,
} from "../utils/constants";
import { takeCookie } from "../utils/cookies";
import { validateAccessToken } from "../utils/validateAccessToken";
import useSpotify from "hooks/useSpotify";
import { decode } from "html-entities";

interface DashboardProps {
  user: SpotifyUserResponse | null;
  accessToken: string | undefined;
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
  props: {
    user?: SpotifyUserResponse | null;
  };
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const refreshToken = takeCookie(REFRESHTOKENCOOKIE, cookies);
  let accessToken = takeCookie(ACCESSTOKENCOOKIE, cookies);
  const user = accessToken ? await validateAccessToken(accessToken) : undefined;

  if (query.code) {
    try {
      const _res = await getAuthorizationByCode(query.code);
      if (!_res.ok) {
        res.writeHead(307, { Location: "/" });
        res.end();
      }
      const data = await _res.json();
      if (data) {
        res.setHeader("Set-Cookie", [
          `${ACCESSTOKENCOOKIE}=${data.accessToken}; Path=/;"`,
          `${REFRESHTOKENCOOKIE}=${data.refreshToken}; Path=/;"`,
          `${EXPIRETOKENCOOKIE}=${data.expiresIn}; Path=/;"`,
        ]);
      }
      accessToken = data.accessToken;
    } catch (error) {
      console.error(error);
    }
  }

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

    if (!user || !accessToken) {
      if (res) {
        res.writeHead(307, { Location: "/" });
        res.end();
      } else {
        Router.replace("/");
      }
    }
    return {
      props: { user: user || null },
    };
  } catch (error) {
    console.log(error);
  }
  return {
    props: {},
  };
}
