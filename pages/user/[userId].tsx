import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { refreshAccessTokenRequest } from "../../lib/requests";
import { SpotifyUserResponse } from "types/spotify";
import { ACCESSTOKENCOOKIE, REFRESHTOKENCOOKIE } from "../../utils/constants";
import { takeCookie } from "../../utils/cookies";
import { validateAccessToken } from "../../utils/validateAccessToken";
import Router, { useRouter } from "next/router";
import { ContentHeader } from "components/forPlaylistsPage/ContentHeader";
import formatNumber from "utils/formatNumber";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect } from "react";

interface CurrentUserProps {
  currentUser: SpotifyApi.UserProfileResponse | null;
  accessToken?: string;
  user: SpotifyUserResponse | null;
  currentUserPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse;
}

const CurrentUser: NextPage<CurrentUserProps> = ({
  currentUser,
  user,
  accessToken,
  currentUserPlaylists,
}) => {
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
    trackWithGoogleAnalitycs();

    setIsLogin(true);

    setAccessToken(accessToken);

    setUser(user);
  }, [
    accessToken,
    currentUser,
    router,
    setAccessToken,
    setIsLogin,
    setUser,
    trackWithGoogleAnalitycs,
    user,
  ]);

  return (
    <main>
      <ContentHeader>
        <img src={currentUser?.images?.[0].url} alt="" />
        <div className="info">
          <h2>PROFILE</h2>
          <h1>{currentUser?.display_name}</h1>
          <div>
            <p>
              <span>
                {formatNumber(currentUser?.followers?.total ?? 0)} seguidores
              </span>
              <span>
                &nbsp;&middot; {formatNumber(currentUserPlaylists.total ?? 0)}{" "}
                playlists publicas
              </span>
            </p>
          </div>
        </div>
      </ContentHeader>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
        div.info {
          align-self: flex-end;
          width: calc(100% - 310px);
        }
        h1 {
          color: #fff;
          margin: 0;
          pointer-events: none;
          user-select: none;
          padding: 0.08em 0px;
          font-size: ${(currentUser?.display_name?.length ?? 0) < 20
            ? "96px"
            : (currentUser?.display_name?.length ?? 0) < 30
            ? "72px"
            : "48px"};
          line-height: ${(currentUser?.display_name?.length ?? 0) < 20
            ? "96px"
            : (currentUser?.display_name?.length ?? 0) < 30
            ? "72px"
            : "48px"};
          visibility: visible;
          width: 100%;
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: none;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          line-break: anywhere;
          -webkit-line-clamp: 3;
        }
        h2 {
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
          font-weight: 700;
        }
        img {
          border-radius: 50%;
          box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
          margin-right: 15px;
          align-self: center;
          align-self: flex-end;
          height: 232px;
          margin-inline-end: 24px;
          min-width: 232px;
          width: 232px;
        }
      `}</style>
    </main>
  );
};

export default CurrentUser;

export async function getServerSideProps({
  params: { userId },
  req,
  res,
}: {
  params: { userId: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: CurrentUserProps;
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

  async function getCurrentUser(userId: string, accessToken?: string) {
    if (!accessToken || !userId) {
      return null;
    }
    const res = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
        }`,
      },
    });
    const data = res.json();
    return data;
  }
  async function getCurrentUserPlaylists(userId: string, accessToken?: string) {
    if (!accessToken || !userId) {
      return null;
    }
    const res = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
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
    const data = res.json();
    return data;
  }

  const currentUser = await getCurrentUser(userId, accessToken);
  const currentUserPlaylists = await getCurrentUserPlaylists(
    userId,
    accessToken
  );

  return {
    props: {
      currentUser,
      accessToken,
      user: user ?? null,
      currentUserPlaylists: currentUserPlaylists ?? null,
    },
  };
}
