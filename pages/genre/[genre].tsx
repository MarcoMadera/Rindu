import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import PresentationCard from "components/PresentationCard";
import useAuth from "hooks/useAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getCategoryPlaylists } from "utils/spotifyCalls/getCategoryPlaylists";
import useHeader from "hooks/useHeader";
import { getSingleCategoryInfo } from "utils/spotifyCalls/getSingleCategoryInfo";
import useSpotify from "hooks/useSpotify";
import { CardType } from "components/CardContent";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import Grid from "components/Grid";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getTranslations, Page } from "utils/getTranslations";

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
      {categoryInfo && <Heading number={1}>{categoryInfo?.name}</Heading>}
      {playlists && playlists?.items?.length > 0 ? (
        <Grid>
          {playlists?.items?.map(({ images, name, description, id }) => {
            return (
              <PresentationCard
                key={id}
                type={CardType.PLAYLIST}
                images={images}
                title={name}
                subTitle={description ?? ""}
                id={id}
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
      categoryInfo:
        categoryInfo.status === "fulfilled" ? categoryInfo.value ?? null : null,
      playlists:
        categories.status === "fulfilled"
          ? categories.value?.playlists ?? null
          : null,
      accessToken: accessToken ?? null,
      user: user ?? null,
      translations,
    },
  };
}
