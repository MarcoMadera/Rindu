import { ReactElement, useEffect, useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import {
  BigPill,
  CardTrack,
  ContentContainer,
  Heading,
  PageHeader,
  Paragraph,
  PlayButton,
  PlaylistTopBarExtraField,
} from "components";
import { CardType } from "components/CardTrack/CardTrack";
import { Heart } from "components/icons";
import {
  useAuth,
  useHeader,
  useSpotify,
  useToast,
  useToggle,
  useTranslations,
} from "hooks";
import { LyricsAction } from "types/lyrics";
import { HeaderType } from "types/pageHeader";
import { ITranslations } from "types/translations";
import {
  chooseImage,
  getAuth,
  getLyrics,
  getTranslations,
  getValidCookieLocale,
  serverRedirect,
  templateReplace,
  within,
} from "utils";
import {
  checkTracksInLibrary,
  getArtistById,
  getArtistTopTracks,
  getTrack,
  removeTracksFromLibrary,
  saveTracksToLibrary,
} from "utils/spotifyCalls";

interface TrackPageProps {
  track: SpotifyApi.TrackObjectFull | null;
  lyrics: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: ITranslations;
}

export default function TrackPage({
  track,
  lyrics,
}: InferGetServerSidePropsType<
  typeof getServerSideProps
>): ReactElement | null {
  const { setElement, setHeaderColor } = useHeader({
    showOnFixed: false,
  });
  const { user } = useAuth();
  const [tracksInLibrary, setTracksInLibrary] = useState<string[]>([]);
  const [showMoreTopTracks, setShowMoreTopTracks] = useToggle(false);
  const [artistTopTracks, setArtistTopTracks] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);
  const { setPageDetails, setAllTracks, isPlaying, allTracks } = useSpotify();
  const [artistInfo, setArtistInfo] =
    useState<SpotifyApi.SingleArtistResponse | null>(null);
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const title = `Rindu - ${track?.name ?? translations.pages.track.songs}`;

  useEffect(() => {
    if (track) {
      setPageDetails({
        name: track.name,
        owner: {
          id: track.artists[0].id,
          display_name: track.artists[0].name,
        },
        tracks: {
          total: 1,
        },
        id: track.id,
        images: track.album.images,
        type: "playlist",
      });

      setAllTracks([track, ...artistTopTracks]);
    }
    setElement(() => (
      <PlaylistTopBarExtraField
        isSingle={allTracks.length === 1}
        track={track ?? undefined}
      />
    ));

    return () => {
      setElement(null);
    };
  }, [
    artistTopTracks,
    setAllTracks,
    setElement,
    setHeaderColor,
    setPageDetails,
    track,
    allTracks.length,
  ]);

  useEffect(() => {
    if (!track) return;
    checkTracksInLibrary([track.id]).then((tracksInLibrary) => {
      if (tracksInLibrary?.[0]) {
        setTracksInLibrary((value) => [...value, track.id]);
      }
    });
  }, [track]);

  useEffect(() => {
    if (!track) return;
    getArtistTopTracks(track.artists[0].id, user?.country ?? "US").then(
      (res) => {
        if (res && Array.isArray(res.tracks)) {
          setArtistTopTracks(res.tracks);
          const trackIds = res.tracks.map((track) => track.id);
          checkTracksInLibrary(trackIds).then((tracksInLibrary) => {
            if (tracksInLibrary) {
              setTracksInLibrary((value) => {
                const likedTracks = trackIds.filter(
                  (_, i) => tracksInLibrary[i]
                );
                return [...value, ...likedTracks];
              });
            }
          });
        }
      }
    );

    getArtistById(track.artists[0].id).then((res) => {
      if (res) {
        setArtistInfo(res);
      }
    });
  }, [track, user?.country]);

  if (!track) {
    return null;
  }

  return (
    <ContentContainer hasPageHeader>
      {!isPlaying && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <PageHeader
        key={track?.uri}
        type={HeaderType.Song}
        title={track?.name ?? ""}
        coverImg={chooseImage(track?.album?.images, 300).url}
        duration_s={track?.duration_ms ? track?.duration_ms / 1000 : 0}
        artists={track?.artists ?? []}
        release_date={track?.album?.release_date ?? ""}
        data={track}
      />
      <div className="content">
        <div className="options">
          <PlayButton
            size={56}
            centerSize={28}
            isSingle={allTracks.length === 1}
            track={track ?? undefined}
            allTracks={allTracks}
          />
          <div className="info">
            <Heart
              active={tracksInLibrary.includes(track?.id ?? "")}
              style={{ width: 80, height: 80 }}
              handleLike={async () => {
                if (!track) return null;
                const saveRes = await saveTracksToLibrary([track.id]);
                if (saveRes) {
                  addToast({
                    variant: "success",
                    message: templateReplace(
                      translations.toastMessages.typeAddedTo,
                      [
                        translations.contentType.track,
                        translations.contentType.library,
                      ]
                    ),
                  });
                  return true;
                }
                return null;
              }}
              handleDislike={async () => {
                if (!track) return null;
                const removeRes = await removeTracksFromLibrary([track.id]);
                if (removeRes) {
                  addToast({
                    variant: "success",
                    message: templateReplace(
                      translations.toastMessages.typeRemovedFrom,
                      [
                        translations.contentType.track,
                        translations.contentType.library,
                      ]
                    ),
                  });
                  return true;
                }
                return null;
              }}
            />
          </div>
        </div>
        {lyrics ? (
          <div className="track-lyrics-container">
            <Heading number={3} as="h2">
              {translations.pages.track.lyrics}
            </Heading>
            <Paragraph>{lyrics}</Paragraph>
          </div>
        ) : null}
        {artistInfo && (
          <BigPill
            img={chooseImage(artistInfo.images, 100).url}
            title={translations.pages.track.artist}
            subTitle={artistInfo.name}
            href={`/artist/${artistInfo.id}`}
          />
        )}
        {artistTopTracks.length > 0 && (
          <div className="topTracks">
            <div className="topTracks-header">
              <span>
                {templateReplace(translations.pages.track.popularTracksBy, [
                  <Heading number={3} as="h2" key={track?.artists[0].name}>
                    {track?.artists[0].name ?? ""}
                  </Heading>,
                ])}
              </span>
            </div>
            {artistTopTracks.map((artistTrack, i) => {
              const maxToShow = showMoreTopTracks ? 10 : 5;
              if (i >= maxToShow) {
                return null;
              }

              const isTheSameAsTrack = artistTrack.uri
                ? artistTrack.uri === track?.uri
                : false;
              const sameTrackIndex = artistTopTracks.findIndex(
                (artistTrack) => artistTrack.uri === track?.uri
              );
              const mainTrackExistInArtistTopTracks = sameTrackIndex >= 0;
              const isValidPosition = i - sameTrackIndex >= 0;
              const mainTrackPosition =
                mainTrackExistInArtistTopTracks && isValidPosition ? i : i + 1;
              const position = isTheSameAsTrack ? 0 : mainTrackPosition;

              const isTrackInLibrary = tracksInLibrary.includes(artistTrack.id);

              return (
                <CardTrack
                  isTrackInLibrary={isTrackInLibrary}
                  playlistUri=""
                  track={artistTrack}
                  key={artistTrack.id}
                  type={CardType.Presentation}
                  position={position}
                  visualPosition={i + 1}
                  isSingleTrack
                />
              );
            })}
            <button
              type="button"
              className="show-more"
              onClick={() => {
                setShowMoreTopTracks.toggle();
              }}
            >
              {showMoreTopTracks
                ? translations.pages.track.showLess
                : translations.pages.track.showMore}
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .topTracks-header {
          display: block;
          margin-bottom: 20px;
          width: 100%;
        }
        .topTracks-header span {
          display: block;
          color: #ffffffb3;
        }
        .info :global(button) {
          margin-left: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: none;
        }
        .info :global(button):focus,
        .info :global(button):hover {
          transform: scale(1.06);
        }
        .info :global(button):active {
          transform: scale(1);
        }
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          margin: 16px 0;
          flex-direction: row;
        }
        button.show-more:hover {
          color: white;
        }
        button.show-more {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 18px;
          font-weight: bold;
        }
        .content {
          margin: 0 32px;
        }
        .tracks-lyrics-container {
          position: relative;
          margin: 20px 0;
          z-index: 1;
        }
        .lyrics {
          color: rgb(179, 179, 179);
          font-weight: 400;
          letter-spacing: -0.04em;
          margin: 0;
          white-space: pre-wrap;
          font-size: 1rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
        }
        .topTracks {
          display: flex;
          flex-wrap: wrap;
          margin-top: 32px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .options {
            margin: 0 8px;
          }
          .content {
            margin: 0;
          }
          .topTracks-header {
            margin: 0 8px 10px 8px;
          }
          button.show-more {
            padding: 16px 8px;
          }
        }
      `}</style>
    </ContentContainer>
  );
}

export const getServerSideProps = (async (context) => {
  const id = context.params?.id;
  const translations = getTranslations(context);
  const cookies = context.req?.headers?.cookie;
  if (!cookies || !id) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const { user } = (await getAuth(context)) ?? {};
  const track = await getTrack(id, user?.country ?? "US", context);
  let lyrics: string | null = null;

  if (track?.name && track.artists[0].name) {
    const lyricsResponse = await within(
      getLyrics(
        track.artists[0].name,
        track.name,
        id,
        LyricsAction.LoadTrackPage
      ),
      6000
    );
    if (!lyricsResponse.data?.isFullscreen && lyricsResponse.data?.lyrics) {
      lyrics = lyricsResponse.data.lyrics;
    }
  }

  return {
    props: {
      track,
      lyrics,
      user: user ?? null,
      translations,
      locale: getValidCookieLocale(context),
    },
  };
}) satisfies GetServerSideProps<Partial<TrackPageProps>, { id: string }>;
