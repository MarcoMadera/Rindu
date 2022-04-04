import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useRouter } from "next/router";
import { ContentHeader } from "components/forPlaylistsPage/ContentHeader";
import formatNumber from "utils/formatNumber";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect } from "react";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getUserById } from "utils/spotifyCalls/getUserById";
import { getPlaylistsFromUser } from "utils/spotifyCalls/getPlaylistsFromUser";
import useHeader from "hooks/useHeader";
import { getMainColorFromImage } from "utils/getMainColorFromImage";

interface CurrentUserProps {
  currentUser: SpotifyApi.UserObjectPublic | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
  currentUserPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
}

const CurrentUser: NextPage<CurrentUserProps | null> = ({
  currentUser,
  user,
  accessToken,
  currentUserPlaylists,
}) => {
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const router = useRouter();
  const { setHeaderColor } = useHeader();

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
        <img
          src={currentUser?.images?.[0].url}
          alt=""
          id="cover-image"
          onLoad={() => {
            setHeaderColor(
              (prev) => getMainColorFromImage("cover-image") ?? prev
            );
          }}
        />
        <div className="info">
          <h2>PROFILE</h2>
          <h1>{currentUser?.display_name}</h1>
          <div>
            <p>
              <span>
                {formatNumber(currentUser?.followers?.total ?? 0)} seguidores
              </span>
              <span>
                &nbsp;&middot; {formatNumber(currentUserPlaylists?.total ?? 0)}{" "}
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
          object-fit: cover;
          object-position: center center;
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
  props: CurrentUserProps | null;
}> {
  const cookies = req?.headers?.cookie;

  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }

  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const currentUser = await getUserById(userId, accessToken);
  const currentUserPlaylists = await getPlaylistsFromUser(userId, accessToken);

  return {
    props: {
      currentUser,
      accessToken,
      user: user ?? null,
      currentUserPlaylists: currentUserPlaylists ?? null,
    },
  };
}
