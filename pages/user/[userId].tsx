import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect } from "react";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getUserById } from "utils/spotifyCalls/getUserById";
import { getPlaylistsFromUser } from "utils/spotifyCalls/getPlaylistsFromUser";
import PageHeader from "components/PageHeader";
import { HeaderType } from "types/pageHeader";
import ContentContainer from "components/ContentContainer";
import { getSiteUrl } from "utils/enviroment";

interface CurrentUserProps {
  currentUser: SpotifyApi.UserObjectPublic | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
  currentUserPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
}

const CurrentUser: NextPage<CurrentUserProps> = ({
  currentUser,
  user,
  accessToken,
  currentUserPlaylists,
}) => {
  const { setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
    trackWithGoogleAnalitycs();

    setAccessToken(accessToken);

    setUser(user);
  }, [
    accessToken,
    currentUser,
    router,
    setAccessToken,
    setUser,
    trackWithGoogleAnalitycs,
    user,
  ]);

  return (
    <ContentContainer hasPageHeader>
      <PageHeader
        type={HeaderType.profile}
        title={currentUser?.display_name ?? ""}
        coverImg={
          currentUser?.images?.[0]?.url ??
          currentUser?.images?.[1]?.url ??
          `${getSiteUrl()}/defaultSongCover.jpeg`
        }
        totalPublicPlaylists={currentUserPlaylists?.total ?? 0}
        totalFollowers={currentUser?.followers?.total ?? 0}
      />
    </ContentContainer>
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
