import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import PlaylistCard from "../components/forDashboardPage/PlaylistCard";
import useAuth from "../hooks/useAuth";
import useSpotify from "../hooks/useSpotify";
import {
  getAuthorizationByCode,
  getPlaylistsRequest,
  refreshAccessTokenRequest,
} from "../lib/requests";
import {
  PlaylistItem,
  SpotifyUserResponse,
  UserPlaylistsResponse,
} from "../lib/types";
import {
  ACCESSTOKENCOOKIE,
  EXPIRETOKENCOOKIE,
  REFRESHTOKENCOOKIE,
} from "../utils/constants";
import { takeCookie } from "../utils/cookies";
import { validateAccessToken } from "../utils/validateAccessToken";

interface DashboardProps {
  user: SpotifyUserResponse | null;
  userPlaylists: UserPlaylistsResponse;
}

const Dashboard: NextPage<DashboardProps> = ({ user, userPlaylists }) => {
  const { playlists, getPlaylists, setPlaylists } = useSpotify();
  const { setIsLogin, setUser } = useAuth();
  const [offset, setOffSet] = useState<number>(10);
  useEffect(() => {
    setPlaylists(userPlaylists.items);
    setIsLogin(true);
    setUser(user);
  }, [setIsLogin, setPlaylists, userPlaylists.items, setUser, user]);

  useEffect(() => {
    const expireIn = parseInt(takeCookie(EXPIRETOKENCOOKIE) || "3600", 10);
    const interval = setInterval(() => {
      const refreshToken = takeCookie(REFRESHTOKENCOOKIE);
      if (refreshToken) {
        fetch("/api/spotify-refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    }, (expireIn - 60) * 1000);
    return () => clearTimeout(interval);
  }, []);

  function loadMorePlaylist(e: { preventDefault: () => void }) {
    e.preventDefault();
    setOffSet((value) => value + 10);
    getPlaylists(offset, 10);
  }

  return (
    <>
      <main>
        <h1>Escoge una playlist</h1>
        <section>
          {playlists?.length > 0
            ? playlists.map(
                ({ images, name, description, id, owner }: PlaylistItem) => {
                  if (owner !== user?.id) {
                    return null;
                  }
                  return (
                    <PlaylistCard
                      key={id}
                      images={images}
                      name={name}
                      description={description}
                      playlistId={id}
                    />
                  );
                }
              )
            : null}
        </section>
        {userPlaylists?.total > playlists?.length && (
          <button onClick={loadMorePlaylist}>Cargar más playlists</button>
        )}
      </main>
      <style jsx>{`
        main {
          text-align: center;
        }
        h1 {
          color: #eb5757;
          text-align: center;
          font-weight: bold;
          margin: 0;
        }
        section {
          display: grid;
          grid-template-columns: repeat(auto-fit, 200px);
          -moz-column-gap: 30px;
          column-gap: 30px;
          row-gap: 34px;
          margin: 20px 140px 50px 140px;
          justify-content: space-between;
        }
        button {
          min-width: 200px;
          padding: 10px;
          border: none;
          background-color: #181818;
          color: #e5e5e5;
          font-family: inherit;
          cursor: pointer;
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
    userPlaylists?: UserPlaylistsResponse;
  };
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const refreshToken = takeCookie(REFRESHTOKENCOOKIE, cookies);
  if (refreshToken) {
    await refreshAccessTokenRequest(refreshToken);
  }
  try {
    let accessToken;
    accessToken = cookies ? takeCookie(ACCESSTOKENCOOKIE, cookies) : undefined;
    if (query.code) {
      try {
        const _res = await getAuthorizationByCode(query.code);
        if (!_res.ok) {
          throw Error(_res.statusText);
        }
        const data = await _res.json();
        accessToken = data.accessToken;
        res.setHeader("Set-Cookie", [
          `${ACCESSTOKENCOOKIE}=${accessToken}; Path=/;"`,
          `${REFRESHTOKENCOOKIE}=${data.refreshToken}; Path=/;"`,
          `${EXPIRETOKENCOOKIE}=${data.expiresIn}; Path=/;"`,
        ]);
      } catch (error) {
        console.error(error);
      }
    }
    const user = await validateAccessToken(accessToken);
    if (!user) {
      if (res) {
        res.writeHead(307, { Location: "/" });
        res.end();
      } else {
        Router.replace("/");
      }
    }
    const playlistsRequest = await getPlaylistsRequest(0, 10, accessToken);
    const userPlaylists = await playlistsRequest.json();
    return {
      props: { user: user || null, userPlaylists },
    };
  } catch (error) {
    console.log(error);
  }
  return {
    props: {},
  };
}
