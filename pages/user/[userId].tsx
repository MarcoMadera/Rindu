import { useEffect } from "react";

import { decode } from "html-entities";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";

import {
  Carousel,
  ContentContainer,
  Grid,
  Heading,
  PageHeader,
  PresentationCard,
} from "components";
import { CardType } from "components/CardContent";
import {
  useAnalytics,
  useAuth,
  useTranslations,
  useUserPlaylists,
} from "hooks";
import { HeaderType } from "types/pageHeader";
import {
  fullFilledValue,
  getAuth,
  getSiteUrl,
  getTopTracksCards,
  getTranslations,
  Page,
  serverRedirect,
} from "utils";
import { getPlaylistsFromUser, getUserById } from "utils/spotifyCalls";

interface CurrentUserProps {
  currentUser: SpotifyApi.UserObjectPublic | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
  currentUserPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
  translations: Record<string, string>;
}

const CurrentUser: NextPage<CurrentUserProps> = ({
  currentUser,
  currentUserPlaylists,
}) => {
  const { trackWithGoogleAnalytics } = useAnalytics();
  const { user } = useAuth();
  const { translations } = useTranslations();
  const router = useRouter();
  const playlists = useUserPlaylists();
  const isThisUser = currentUser?.id === user?.id;

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
    trackWithGoogleAnalytics();
  }, [currentUser, router, trackWithGoogleAnalytics]);

  return (
    <ContentContainer hasPageHeader>
      <PageHeader
        type={HeaderType.Profile}
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
      <ContentContainer>
        {isThisUser && (
          <>
            <Carousel title={translations.topTracksPlaylistHeading} gap={24}>
              {getTopTracksCards(user, translations).map((item) => {
                if (!item) return null;
                const { images, name, id, subTitle, url } = item;
                return (
                  <PresentationCard
                    type={CardType.SIMPLE}
                    key={name}
                    images={images}
                    title={name}
                    id={id}
                    subTitle={subTitle}
                    url={url}
                  />
                );
              })}
            </Carousel>
            {playlists?.length > 0 && (
              <>
                <Heading id={"title-playlist"} number={2}>
                  {translations.yourPlaylists}
                </Heading>
                <Grid>
                  {playlists.map(({ images, name, description, id, owner }) => {
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
                  })}
                </Grid>
              </>
            )}
          </>
        )}
        {!isThisUser && currentUserPlaylists && (
          <div style={{ marginTop: "16px" }}>
            <Heading id={"title-playlist"} number={2}>
              {translations.playlists}
            </Heading>
            <Grid>
              {currentUserPlaylists?.items.length > 0
                ? currentUserPlaylists?.items?.map(
                    ({ images, name, description, id, owner }) => {
                      return (
                        <PresentationCard
                          type={CardType.PLAYLIST}
                          key={id}
                          images={images}
                          title={name}
                          subTitle={
                            decode(description) ||
                            `${translations.by} ${
                              owner.display_name || owner.id
                            }`
                          }
                          id={id}
                        />
                      );
                    }
                  )
                : null}
            </Grid>
          </div>
        )}
      </ContentContainer>
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
