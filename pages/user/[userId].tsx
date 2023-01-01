import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";
import useAnalytics from "hooks/useAnalytics";
import { useEffect } from "react";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getUserById } from "utils/spotifyCalls/getUserById";
import { getPlaylistsFromUser } from "utils/spotifyCalls/getPlaylistsFromUser";
import PageHeader from "components/PageHeader";
import { HeaderType } from "types/pageHeader";
import ContentContainer from "components/ContentContainer";
import { getSiteUrl } from "utils/environment";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getTranslations, Page } from "utils/getTranslations";
import { fullFilledValue } from "utils/fullFilledValue";
import Grid from "components/Grid";
import useUserPlaylists from "hooks/useUserPlaylists";
import PresentationCard from "components/PresentationCard";
import { CardType } from "components/CardContent";
import { decode } from "html-entities";

interface CurrentUserProps {
  currentUser: SpotifyApi.UserObjectPublic | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
  currentUserPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
  translations: Record<string, string>;
}

const CurrentUser: NextPage<CurrentUserProps> = ({
  currentUser,
  user,
  accessToken,
  currentUserPlaylists,
  translations,
}) => {
  const { setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalytics } = useAnalytics();
  const router = useRouter();
  const playlists = useUserPlaylists();
  const isThisUser = currentUser?.id === user?.id;

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
    trackWithGoogleAnalytics();

    setAccessToken(accessToken);

    setUser(user);
  }, [
    accessToken,
    currentUser,
    router,
    setAccessToken,
    setUser,
    trackWithGoogleAnalytics,
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
        data={currentUser}
      />
      {isThisUser && (
        <ContentContainer>
          <Grid>
            {playlists?.length > 0
              ? playlists.map(({ images, name, description, id, owner }) => {
                  return (
                    <PresentationCard
                      type={CardType.PLAYLIST}
                      key={id}
                      images={images}
                      title={name}
                      subTitle={
                        decode(description) ||
                        `${translations.by} ${owner.display_name || owner.id}`
                      }
                      id={id}
                    />
                  );
                })
              : null}
          </Grid>
        </ContentContainer>
      )}
    </ContentContainer>
  );
};

export default CurrentUser;

export async function getServerSideProps({
  params: { userId },
  req,
  res,
  query,
}: {
  params: { userId: string };
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: CurrentUserProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.User);
  const cookies = req?.headers?.cookie;

  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }

  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const currentUserProm = getUserById(userId, accessToken);
  const currentUserPlaylistsProm = getPlaylistsFromUser(userId, accessToken);

  const [currentUser, currentUserPlaylists] = await Promise.allSettled([
    currentUserProm,
    currentUserPlaylistsProm,
  ]);

  return {
    props: {
      currentUser: fullFilledValue(currentUser),
      accessToken,
      user: user ?? null,
      currentUserPlaylists: fullFilledValue(currentUserPlaylists),
      translations,
    },
  };
}
