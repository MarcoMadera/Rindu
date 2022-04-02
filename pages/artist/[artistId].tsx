import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useRouter } from "next/router";
import { ContentHeader } from "components/forPlaylistsPage/ContentHeader";
import formatNumber from "utils/formatNumber";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect } from "react";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getArtistById } from "utils/spotifyCalls/getArtistById";

interface CurrentUserProps {
  currentArtist: SpotifyApi.SingleArtistResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
}

const CurrentUser: NextPage<CurrentUserProps> = ({
  currentArtist,
  user,
  accessToken,
}) => {
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const router = useRouter();

  useEffect(() => {
    if (!currentArtist) {
      router.push("/");
    }
    trackWithGoogleAnalitycs();

    setIsLogin(true);

    setAccessToken(accessToken);

    setUser(user);
  }, [
    accessToken,
    currentArtist,
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
        <img src={currentArtist?.images?.[0].url} alt="" />
        <div className="info">
          <h2>ARTIST</h2>
          <h1>{currentArtist?.name}</h1>
          <div>
            <p>
              <span>
                {formatNumber(currentArtist?.followers?.total ?? 0)} seguidores
              </span>
              <span>
                &nbsp;&middot; {formatNumber(currentArtist?.popularity ?? 0)}{" "}
                popularity
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
          font-size: ${(currentArtist?.name?.length ?? 0) < 20
            ? "96px"
            : (currentArtist?.name?.length ?? 0) < 30
            ? "72px"
            : "48px"};
          line-height: ${(currentArtist?.name?.length ?? 0) < 20
            ? "96px"
            : (currentArtist?.name?.length ?? 0) < 30
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
  params: { artistId },
  req,
  res,
}: {
  params: { artistId: string };
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

  const currentArtist = await getArtistById(artistId, accessToken, cookies);

  return {
    props: {
      currentArtist,
      accessToken,
      user: user ?? null,
    },
  };
}
