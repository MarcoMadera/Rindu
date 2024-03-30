import { ReactElement, useEffect } from "react";

import { decode } from "html-entities";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import {
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
import { ITranslations } from "types/translations";
import {
  chooseImage,
  fullFilledValue,
  getAuth,
  getTopTracksCards,
  getTranslations,
  serverRedirect,
} from "utils";
import { getPlaylistsFromUser, getUserById } from "utils/spotifyCalls";

interface CurrentUserProps {
  currentUser: SpotifyApi.UserObjectPublic | null;
  user: SpotifyApi.UserObjectPrivate | null;
  currentUserPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
  translations: ITranslations;
  topTracksCard: ReturnType<typeof getTopTracksCards>;
}

const CurrentUser = ({
  currentUser,
  currentUserPlaylists,
  topTracksCard,
}: InferGetServerSidePropsType<
  typeof getServerSideProps
>): ReactElement | null => {
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

  if (!currentUser) {
    return null;
  }

  return (
    <ContentContainer hasPageHeader>
      <PageHeader
        key={currentUser?.uri}
        type={HeaderType.Profile}
        title={currentUser?.display_name ?? ""}
        coverImg={chooseImage(currentUser?.images, 300).url}
        totalPublicPlaylists={currentUserPlaylists?.total ?? 0}
        totalFollowers={currentUser?.followers?.total ?? 0}
        data={currentUser}
      />
      <ContentContainer>
        {isThisUser && (
          <>
            <Heading id={"title-topTracksPlaylistHeading"} number={2}>
              {translations.pages.user.topTracksPlaylistHeading}
            </Heading>
            <Grid>
              {topTracksCard.map((item) => {
                if (!item) return null;
                const { images, name, url } = item;
                return (
                  <PresentationCard
                    type={CardType.SIMPLE}
                    key={name}
                    images={images}
                    title={name}
                    id={name}
                    subTitle={""}
                    url={url}
                  />
                );
              })}
            </Grid>
            {playlists?.length > 0 && (
              <>
                <Heading id={"title-playlist"} number={2}>
                  {translations.pages.user.yourPlaylists}
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
                          `${translations.pages.user.by} ${owner.display_name ?? owner.id}`
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
              {translations.pages.user.playlists}
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
                            `${translations.pages.user.by} ${
                              owner.display_name ?? owner.id
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

export const getServerSideProps = (async (context) => {
  const translations = getTranslations(context);
  const cookies = context.req?.headers?.cookie;

  if (!cookies || !context.params) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const userId = context.params.userId;
  const { user } = (await getAuth(context)) ?? {};
  const topTracksCard = getTopTracksCards(user, translations);
  const currentUserProm = getUserById(userId, context);
  const currentUserPlaylistsProm = getPlaylistsFromUser(userId, context);

  const [currentUser, currentUserPlaylists] = await Promise.allSettled([
    currentUserProm,
    currentUserPlaylistsProm,
  ]);

  return {
    props: {
      currentUser: fullFilledValue(currentUser),
      user: user ?? null,
      currentUserPlaylists: fullFilledValue(currentUserPlaylists),
      translations,
      topTracksCard,
    },
  };
}) satisfies GetServerSideProps<Partial<CurrentUserProps>, { userId: string }>;
