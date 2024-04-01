import { ReactElement, useEffect } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import {
  CardTrack,
  CarouselCards,
  ContentContainer,
  FollowButton,
  Heading,
  PageHeader,
  Paragraph,
  PlayButton,
  PlaylistTopBarExtraField,
  SetList,
} from "components";
import { CardType } from "components/CardContent";
import { CardType as TrackCardType } from "components/CardTrack/CardTrack";
import TextToggleButton from "components/TextToggleButton";
import {
  useAnalytics,
  useAuth,
  useHeader,
  useSpotify,
  useToggle,
  useTranslations,
} from "hooks";
import { HeaderType } from "types/pageHeader";
import { ITranslations } from "types/translations";
import {
  ArtistScrobbleInfo,
  chooseImage,
  fullFilledValue,
  getArtistInfo,
  getAuth,
  getCarouselItems,
  getSetLists,
  getTranslations,
  serverRedirect,
  SetLists,
} from "utils";
import {
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
  getRelatedArtists,
} from "utils/spotifyCalls";
import { Follow_type } from "utils/spotifyCalls/follow";
import { Include_groups } from "utils/spotifyCalls/getArtistAlbums";

export interface IMappedAlbumItems {
  id: string;
  name: string;
  images: SpotifyApi.ImageObject[];
  artists: SpotifyApi.ArtistObjectSimplified[];
  release_date: string;
  album_type: "album" | "single" | "compilation";
}
export interface IMappedAlbums {
  total: number;
  items: IMappedAlbumItems[];
}

interface ArtistPageProps {
  currentArtist: SpotifyApi.SingleArtistResponse | null;
  topTracks: SpotifyApi.MultipleTracksResponse | null;
  singleAlbums: IMappedAlbums | null;
  appearAlbums: IMappedAlbums | null;
  relatedArtists: SpotifyApi.ArtistsRelatedArtistsResponse | null;
  user: SpotifyApi.UserObjectPrivate | null;
  setLists: SetLists | null;
  artistInfo: ArtistScrobbleInfo | null;
  translations: ITranslations;
  albums: IMappedAlbums | null;
  compilations: IMappedAlbums | null;
}

export default function ArtistPage({
  currentArtist,
  topTracks,
  singleAlbums,
  appearAlbums,
  relatedArtists,
  setLists,
  artistInfo,
  albums,
  compilations,
}: InferGetServerSidePropsType<
  typeof getServerSideProps
>): ReactElement | null {
  const { user } = useAuth();
  const { trackWithGoogleAnalytics } = useAnalytics();
  const banner = artistInfo?.banner;
  const { setElement } = useHeader({
    alwaysDisplayColor: false,
    disableOpacityChange: !!banner,
    showOnFixed: false,
  });
  const router = useRouter();
  const { setPageDetails, setAllTracks, allTracks } = useSpotify();
  const [showMoreTopTracks, setShowMoreTopTracks] = useToggle();
  const [showMoreAbout, setShowMoreAbout] = useToggle();
  const { translations } = useTranslations();

  useEffect(() => {
    if (!currentArtist || !user) {
      router.push("/");
      return;
    }
    trackWithGoogleAnalytics();
  }, [currentArtist, router, trackWithGoogleAnalytics, user]);

  useEffect(() => {
    setElement(() => <PlaylistTopBarExtraField uri={currentArtist?.uri} />);
    const user: SpotifyApi.UserObjectPublic = {
      display_name: currentArtist?.name,
      id: currentArtist?.id ?? "",
      images: currentArtist?.images,
      external_urls: { spotify: currentArtist?.external_urls.spotify ?? "" },
      href: "",
      uri: "",
      type: "user",
    };

    const items =
      topTracks?.tracks?.map((track) => ({
        ...track,
        added_at: "",
        track: track,
        is_local: false,
      })) ?? [];

    setPageDetails({
      name: currentArtist?.name,
      uri: currentArtist?.uri,
      followers: { total: currentArtist?.followers?.total },
      description: currentArtist?.name,
      id: currentArtist?.id,
      tracks: { total: 10 },
      owner: user,
      type: "artist",
    });
    setAllTracks(
      items.map((track) => ({
        ...track,
        audio: track.preview_url,
        type: "track",
      }))
    );
  }, [
    topTracks,
    setElement,
    setPageDetails,
    router,
    setAllTracks,
    currentArtist?.name,
    currentArtist?.id,
    currentArtist?.images,
    currentArtist?.external_urls.spotify,
    currentArtist?.uri,
    currentArtist?.followers?.total,
  ]);

  const artistBiography = artistInfo?.bio?.content;

  const carousels = [
    {
      type: CardType.ALBUM,
      title: translations.pages.artist.albumsCarouselTitle,
      items: albums,
    },
    {
      type: CardType.ALBUM,
      title: translations.pages.artist.singleAlbumsCarouselTitle,
      items: singleAlbums,
    },
    {
      type: CardType.ALBUM,
      title: translations.pages.artist.appearAlbumsCarouselTitle,
      items: appearAlbums,
    },
    {
      type: CardType.ALBUM,
      title: translations.pages.artist.compilationsCarouselTitle,
      items: compilations,
    },
    {
      type: CardType.ARTIST,
      title: translations.pages.artist.relatedArtistsCarouselTitle,
      items: relatedArtists,
    },
  ];

  if (!currentArtist) return null;

  return (
    <ContentContainer hasPageHeader>
      <PageHeader
        key={currentArtist?.uri}
        type={HeaderType.Artist}
        title={currentArtist?.name ?? ""}
        coverImg={chooseImage(currentArtist?.images, 300).url}
        totalFollowers={currentArtist?.followers?.total ?? 0}
        popularity={currentArtist?.popularity ?? 0}
        banner={banner ?? ""}
        disableOpacityChange={!!banner}
        stats={artistInfo?.stats}
        data={currentArtist}
      />
      <div className="options">
        <PlayButton
          uri={currentArtist?.uri}
          size={56}
          centerSize={28}
          allTracks={allTracks}
        />
        <FollowButton type={Follow_type.Artist} id={currentArtist?.id} />
      </div>
      <div className="content">
        {topTracks?.tracks && topTracks?.tracks?.length > 0 ? (
          <Heading number={2}>{translations.pages.artist.popular}</Heading>
        ) : null}
        <div className="popular-content">
          <div className="topTracks">
            {topTracks?.tracks?.map((track, i) => {
              const maxToShow = showMoreTopTracks ? 10 : 5;
              if (i >= maxToShow) {
                return null;
              }
              return (
                <CardTrack
                  isTrackInLibrary={false}
                  playlistUri=""
                  track={track}
                  key={track.id}
                  isSingleTrack
                  position={i}
                  type={TrackCardType.Playlist}
                />
              );
            })}
            <TextToggleButton
              isToggle={showMoreTopTracks}
              toggleHandlers={setShowMoreTopTracks}
              activeText={translations.pages.artist.showLess}
              inactiveText={translations.pages.artist.showMore}
            />
          </div>
          <SetList setLists={setLists} artistId={currentArtist?.id} />
        </div>
        {carousels.map(({ title, items, type }) => {
          if (!items) return null;
          const carouselItems = getCarouselItems(type, items);
          return (
            <CarouselCards
              key={title}
              title={title}
              items={carouselItems}
              type={type}
            />
          );
        })}
        {artistBiography && (
          <section className="about">
            <div>
              <Heading number={3} as="h2">
                {translations.pages.artist.about}
              </Heading>
              {showMoreAbout ? (
                <Paragraph>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: artistInfo?.bio?.content,
                    }}
                  ></span>
                </Paragraph>
              ) : (
                <Paragraph>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: artistInfo?.bio?.summary,
                    }}
                  ></span>
                </Paragraph>
              )}
              <TextToggleButton
                isToggle={showMoreAbout}
                toggleHandlers={setShowMoreAbout}
                activeText={translations.pages.artist.readLess}
                inactiveText={translations.pages.artist.readMore}
              />
            </div>
            <div className="artist-about-img-container">
              {artistInfo?.thumb && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="artist-about-img"
                  src={artistInfo?.thumb}
                  alt={currentArtist?.name}
                />
              )}
            </div>
          </section>
        )}
        {setLists ? (
          <div className="attribution">
            <Paragraph>
              {translations.pages.artist.concertSetlistOn}{" "}
              <a
                href="https://www.setlist.fm/"
                target="_blank"
                rel="noreferrer noopener"
              >
                setlist.fm
              </a>
            </Paragraph>
          </div>
        ) : null}
      </div>
      <style jsx>{`
        .attribution {
          margin-top: 16px;
          padding-bottom: 24px;
        }
        .attribution a,
        .about :global(a) {
          color: #ffffffb3;
        }
        .attribution p {
          font-size: 0.6875rem;
          line-height: 1rem;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          color: #ffffffb3;
          margin: 0;
        }
        .content .read-more {
          margin-top: 16px;
          padding: 0;
        }
        .popular-content {
          display: ${setLists ? "flex" : "block"};
        }
        .about {
          display: grid;
          grid-template-columns: minmax(180px, 700px) minmax(180px, 1fr);
        }
        .artist-about-img-container {
          display: flex;
          justify-content: center;
        }
        .artist-about-img {
          width: 100%;
          margin-top: 50px;
          max-width: 400px;
          height: fit-content;
          border-radius: 10px;
          max-height: 400px;
          aspect-ratio: 1;
        }
        .options {
          display: flex;
          padding: 0 32px;
          position: relative;
          width: 100%;
          align-items: center;
          margin: 16px 0;
          flex-direction: row;
          z-index: 999999;
          position: relative;
        }
        .content {
          padding: 32px;
          padding-bottom: 30px;
          position: relative;
          background-color: transparent;
        }
        .topTracks {
          display: flex;
          flex-wrap: wrap;
          margin-top: 32px;
          z-index: ${banner ? "999999" : "0"};
          position: relative;
          flex: 60%;
          height: fit-content;
        }
        .topTracks > :global(:last-child) {
          padding: 0 18px;
        }
        @media (max-width: 768px) {
          .options {
            padding: 32px 32px;
          }
          .content {
            padding: 0;
          }
          .popular-content,
          .about,
          .content > :global(h2),
          .attribution {
            padding: 0 16px;
          }
        }
        @media (max-width: 500px) {
          .popular-content,
          .about {
            display: block;
          }
        }
      `}</style>
    </ContentContainer>
  );
}

export const getServerSideProps = (async (context) => {
  const translations = getTranslations(context);
  const cookies = context.req?.headers?.cookie;
  const artistId = context.params?.artistId;
  if (!cookies || !artistId) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const { user } = (await getAuth(context)) ?? {};

  const currentArtist = await getArtistById(artistId, context);
  const setListAPIKey = process.env.SETLIST_FM_API_KEY;
  const setListsProm = getSetLists(currentArtist?.name, setListAPIKey);
  const artistInfoProm = getArtistInfo(currentArtist?.name);
  const topTracksProm = getArtistTopTracks(
    artistId,
    user?.country ?? "US",
    context
  );
  const singleAlbumsProm = getArtistAlbums(
    artistId,
    user?.country ?? "US",
    Include_groups.Single,
    context
  );
  const appearAlbumsProm = getArtistAlbums(
    artistId,
    user?.country ?? "US",
    Include_groups.AppearsOn,
    context
  );
  const albumsProm = getArtistAlbums(
    artistId,
    user?.country ?? "US",
    Include_groups.Album,
    context
  );
  const compilationsProm = getArtistAlbums(
    artistId,
    user?.country ?? "US",
    Include_groups.Compilation,
    context
  );

  const relatedArtistsProm = getRelatedArtists(artistId, context);

  const [
    setLists,
    artistInfo,
    topTracks,
    singleAlbums,
    appearAlbums,
    relatedArtists,
    albums,
    compilations,
  ] = await Promise.allSettled([
    setListsProm,
    artistInfoProm,
    topTracksProm,
    singleAlbumsProm,
    appearAlbumsProm,
    relatedArtistsProm,
    albumsProm,
    compilationsProm,
  ]);

  function mapAlbumData(album: SpotifyApi.ArtistsAlbumsResponse | null) {
    if (!album) return null;
    const items = album.items.map((item) => ({
      id: item.id,
      name: item.name,
      images: item.images,
      artists: item.artists,
      release_date: item.release_date,
      album_type: item.album_type,
    }));

    return {
      items,
      total: album.total,
    };
  }

  return {
    props: {
      currentArtist,
      singleAlbums: mapAlbumData(fullFilledValue(singleAlbums)),
      appearAlbums: mapAlbumData(fullFilledValue(appearAlbums)),
      topTracks: fullFilledValue(topTracks),
      relatedArtists: fullFilledValue(relatedArtists),
      user: user ?? null,
      setLists: fullFilledValue(setLists),
      artistInfo: fullFilledValue(artistInfo),
      albums: mapAlbumData(fullFilledValue(albums)),
      compilations: mapAlbumData(fullFilledValue(compilations)),
      translations,
    },
  };
}) satisfies GetServerSideProps<Partial<ArtistPageProps>, { artistId: string }>;
