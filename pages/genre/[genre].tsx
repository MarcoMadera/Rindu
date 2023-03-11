import { ReactElement, useEffect } from "react";

import { NextApiRequest, NextApiResponse } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Head from "next/head";

import { ContentContainer, Grid, Heading, PresentationCard } from "components";
import { CardType } from "components/CardContent";
import { useAuth, useHeader, useSpotify } from "hooks";
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
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

export default function Category({
  categoryInfo,
  playlists,
  accessToken,
  user,
}: CategoryProps): ReactElement {
  const { setAccessToken, setUser } = useAuth();
  const { setHeaderColor } = useHeader();
  const { isPlaying } = useSpotify();

  useEffect(() => {
    setHeaderColor("#242424");
  }, [setHeaderColor]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      setUser(user);
    }
  }, [accessToken, setAccessToken, setUser, user]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - {categoryInfo?.name || "Generos"}</title>
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

export async function getServerSideProps({
  params: { genre },
  req,
  res,
  query,
}: {
  params: { genre: string };
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: CategoryProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Genre);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const categoryInfoProm = getSingleCategoryInfo(genre, accessToken, cookies);

  const categoriesProm = getCategoryPlaylists(
    genre,
    user?.country,
    accessToken,
    cookies
  );

  const [categoryInfo, categories] = await Promise.allSettled([
    categoryInfoProm,
    categoriesProm,
  ]);

  return {
    props: {
      categoryInfo: fullFilledValue(categoryInfo),
      playlists: fullFilledValue(categories)?.playlists ?? null,
      accessToken: accessToken ?? null,
      user: user ?? null,
      translations,
    },
  };
}
