import { ReactElement, useEffect } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { ContentContainer, Grid, Heading, PresentationCard } from "components";
import { CardType } from "components/CardContent";
import { useHeader, useSpotify } from "hooks";
import {
  fullFilledValue,
  getAuth,
  getTranslations,
  Page,
  serverRedirect,
} from "utils";
import {
  getCategoryPlaylists,
  getSingleCategoryInfo,
} from "utils/spotifyCalls";

interface CategoryProps {
  categoryInfo: SpotifyApi.SingleCategoryResponse | null;
  playlists: SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified> | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

export default function Category({
  categoryInfo,
  playlists,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
  const { setHeaderColor } = useHeader();
  const { isPlaying } = useSpotify();

  useEffect(() => {
    setHeaderColor("#242424");
  }, [setHeaderColor]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - {categoryInfo?.name ?? "Generos"}</title>
        </Head>
      )}
      {categoryInfo && <Heading number={1}>{categoryInfo.name}</Heading>}
      {playlists && playlists.items?.length > 0 ? (
        <Grid>
          {playlists.items?.map((item) => {
            if (!item) return null;
            return (
              <PresentationCard
                key={item.id}
                type={CardType.PLAYLIST}
                images={item.images}
                title={item.name}
                subTitle={item.description ?? ""}
                id={item.id}
              />
            );
          })}
        </Grid>
      ) : (
        <p>This section is empty</p>
      )}
    </ContentContainer>
  );
}

export const getServerSideProps = (async (context) => {
  const country = (context.query.country ?? "US") as string;
  const translations = getTranslations(country, Page.Genre);
  const cookies = context.req?.headers?.cookie;
  const genre = context.params?.genre;
  if (!cookies || !genre) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const { user } = (await getAuth(context)) ?? {};

  const categoryInfoProm = getSingleCategoryInfo(genre, context);

  const categoriesProm = getCategoryPlaylists(genre, user?.country, context);

  const [categoryInfo, categories] = await Promise.allSettled([
    categoryInfoProm,
    categoriesProm,
  ]);

  return {
    props: {
      categoryInfo: fullFilledValue(categoryInfo),
      playlists: fullFilledValue(categories)?.playlists ?? null,
      user: user ?? null,
      translations,
    },
  };
}) satisfies GetServerSideProps<Partial<CategoryProps>, { genre: string }>;
