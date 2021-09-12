import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import PlaylistCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import {
  getAuthorizationByCode,
  getPlaylistsRequest,
  refreshAccessTokenRequest,
} from "lib/requests";
import {
  PlaylistItem,
  PlaylistItems,
  SpotifyUserResponse,
  UserPlaylistsResponse,
} from "types/spotify";
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
  accessToken: string | undefined;
}

const Dashboard: NextPage<DashboardProps> = ({
  user,
  userPlaylists,
  accessToken,
}) => {
  const { setPlaylists } = useSpotify();
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const [dashBoardPlaylists, setDashBoardPlaylists] = useState<PlaylistItems>(
    userPlaylists.items
  );

  function addItemsToPlaylists(items: PlaylistItems, position: number): void {
    setDashBoardPlaylists((allPlaylists) => {
      const newPlaylists = [...allPlaylists];
      newPlaylists.splice(position, 50, ...items);
      return newPlaylists;
    });
  }

  useEffect(() => {
    const emptyPlaylistItem: PlaylistItem = {
      images: [
        {
          url: "",
        },
      ],
      name: "",
      description: "",
      id: "",
      owner: {
        display_name: "",
        external_urls: { spotify: "" },
        href: "",
        id: "",
        type: "",
        uri: "",
      },
      isPublic: false,
      href: "",
      snapshot_id: "",
      tracks: 0,
    };

    const restPlaylistItems = new Array(
      userPlaylists.total - userPlaylists.items.length
    ).fill(emptyPlaylistItem);

    setPlaylists(userPlaylists.items);

    setDashBoardPlaylists([...userPlaylists?.items, ...restPlaylistItems]);

    setIsLogin(true);

    setUser(user);

    setAccessToken(accessToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPlaylists, user]);

  return (
    <>
      <main>
        <header></header>
        <h1>Escoge una playlist</h1>
        <section>
          {dashBoardPlaylists?.length > 0
            ? dashBoardPlaylists.map(
                ({ images, name, description, id, owner }: PlaylistItem, i) => {
                  return (
                    <PlaylistCard
                      key={id || i}
                      images={images}
                      name={name}
                      description={description}
                      playlistId={id}
                      owner={owner}
                      offSet={i}
                      addItemsToPlaylists={addItemsToPlaylists}
                    />
                  );
                }
              )
            : null}
        </section>
      </main>
      <style jsx>{`
        main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          height: calc(100vh - 90px);
          overflow-y: scroll;
          width: calc(100vw - 200px);
        }
        h1 {
          color: #fff;
          font-weight: bold;
          margin: 0;
        }
        section {
          display: grid;
          grid-template-columns: repeat(auto-fit, 200px);
          -moz-column-gap: 30px;
          column-gap: 30px;
          row-gap: 34px;
          margin: 20px 0 50px 0;

          justify-content: space-between;
        }
        @media screen and (min-width: 0px) and (max-width: 469px) {
          section {
            grid-template-columns: 1fr;
            width: 100%;
            justify-items: center;
          }
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
    accessToken?: string;
  };
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const refreshToken = takeCookie(REFRESHTOKENCOOKIE, cookies);
  let accessToken;
  try {
    if (refreshToken) {
      const re = await refreshAccessTokenRequest(refreshToken);
      const refresh = await re.json();
      accessToken = refresh.accessToken;

      res.setHeader("Set-Cookie", [
        `${ACCESSTOKENCOOKIE}=${accessToken}; Path=/;"`,
      ]);
    } else {
      accessToken = cookies
        ? takeCookie(ACCESSTOKENCOOKIE, cookies)
        : undefined;
    }

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
    const playlistsRequest = await getPlaylistsRequest(0, 50, accessToken);
    const userPlaylists = await playlistsRequest.json();
    return {
      props: { user: user || null, userPlaylists, accessToken },
    };
  } catch (error) {
    console.log(error);
  }
  return {
    props: {},
  };
}
