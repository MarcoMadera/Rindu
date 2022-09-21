import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement, useState } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import PresentationCard from "components/PresentationCard";
import { decode } from "html-entities";
import { getAuth } from "utils/getAuth";
import { getCategories } from "utils/spotifyCalls/getCategories";
import { serverRedirect } from "utils/serverRedirect";
import { getYear } from "utils/getYear";
import Carousel from "components/Carousel";
import { SearchInputElement } from "components/SearchInputElement";
import useSpotify from "hooks/useSpotify";
import { CardType } from "components/CardContent";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import MainTracks from "components/MainTracks";
import BrowseCategories from "components/BrowseCategories";
import { getTranslations, Page } from "utils/getTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

interface SearchPageProps {
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

export default function SearchPage({
  categories,
  accessToken,
  user,
}: SearchPageProps): ReactElement {
  const { setElement, setHeaderColor } = useHeader({ showOnFixed: true });
  const { setUser, setAccessToken } = useAuth();
  const [data, setData] = useState<SpotifyApi.SearchResponse | null>(null);
  const { isPlaying } = useSpotify();

  useEffect(() => {
    setElement(() => <SearchInputElement source="search" setData={setData} />);

    setHeaderColor("#242424");

    return () => {
      setElement(null);
    };
  }, [setElement, setHeaderColor]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
    setUser(user);
  }, [user, accessToken, setUser, setAccessToken]);

  return (
    <ContentContainer>
      {!isPlaying && (
        <Head>
          <title>Rindu - Search</title>
        </Head>
      )}
      {data ? (
        <div>
          {data?.tracks?.items && data.tracks?.items?.length > 0 ? (
            <>
              <MainTracks
                title="Canciones"
                tracksRecommendations={data.tracks?.items.slice(0, 5)}
              />
              <Carousel gap={24}>
                {data.tracks?.items.slice(5)?.map((track) => {
                  return (
                    <PresentationCard
                      type={CardType.TRACK}
                      key={track.id}
                      track={track}
                      images={track.album.images}
                      title={track.name}
                      subTitle={track.artists[0].name}
                      id={track.id}
                      isSingle
                    />
                  );
                })}
              </Carousel>
            </>
          ) : null}
          {data.playlists?.items && data.playlists?.items?.length > 0 ? (
            <Carousel title={"Playlists"} gap={24}>
              {data.playlists?.items?.map(
                ({ images, name, description, id, owner }) => {
                  return (
                    <PresentationCard
                      type={CardType.PLAYLIST}
                      key={id}
                      images={images}
                      title={name}
                      subTitle={
                        decode(description) || `De ${owner.display_name}`
                      }
                      id={id}
                    />
                  );
                }
              )}
            </Carousel>
          ) : null}
          {data.artists?.items && data.artists?.items?.length > 0 ? (
            <Carousel title={"Artists"} gap={24}>
              {data.artists?.items?.map(({ images, name, id }) => {
                return (
                  <PresentationCard
                    type={CardType.ARTIST}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={"Artist"}
                    id={id}
                  />
                );
              })}
            </Carousel>
          ) : null}
          {data.albums?.items && data.albums?.items?.length > 0 ? (
            <Carousel title={"Albums"} gap={24}>
              {data.albums?.items?.map(
                ({ images, name, id, artists, release_date }) => {
                  const artistNames = artists.map((artist) => artist.name);
                  const subTitle = release_date
                    ? `${getYear(release_date)} · Album`
                    : artistNames.join(", ");
                  return (
                    <PresentationCard
                      type={CardType.ALBUM}
                      key={id}
                      images={images}
                      title={name}
                      subTitle={subTitle}
                      id={id}
                    />
                  );
                }
              )}
            </Carousel>
          ) : null}
          {data.shows?.items && data.shows?.items?.length > 0 ? (
            <Carousel title={"Shows"} gap={24}>
              {data.shows?.items?.map(({ images, name, id, publisher }) => {
                return (
                  <PresentationCard
                    type={CardType.SHOW}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={publisher}
                    id={id}
                  />
                );
              })}
            </Carousel>
          ) : null}
          {data.episodes?.items && data.episodes?.items?.length > 0 ? (
            <Carousel title={"Episodes"} gap={24}>
              {(
                data.episodes as SpotifyApi.PagingObject<SpotifyApi.EpisodeObject>
              )?.items?.map(({ images, name, id, description }) => {
                return (
                  <PresentationCard
                    type={CardType.EPISODE}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={description}
                    id={id}
                    isSingle
                  />
                );
              })}
            </Carousel>
          ) : null}
        </div>
      ) : (
        <>
          <Heading number={3} as="h1">
            Browse All
          </Heading>
          <BrowseCategories categories={categories} />
        </>
      )}
    </ContentContainer>
  );
}

export async function getServerSideProps({
  req,
  res,
  query,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: SearchPageProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Search);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const categories = await getCategories(
    user?.country ?? "US",
    50,
    accessToken,
    cookies
  );

  return {
    props: {
      categories,
      accessToken: accessToken ?? null,
      user: user ?? null,
      translations,
    },
  };
}
