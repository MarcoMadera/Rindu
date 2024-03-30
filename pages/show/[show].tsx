import { ReactElement, useEffect, useMemo, useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import {
  ContentContainer,
  EpisodeCard,
  Heading,
  PageHeader,
  PlayButton,
  PlaylistTopBarExtraField,
} from "components";
import { Heart } from "components/icons";
import { useHeader, useSpotify, useToast, useTranslations } from "hooks";
import { AsType } from "types/heading";
import { HeaderType } from "types/pageHeader";
import { ITrack } from "types/spotify";
import { ITranslations } from "types/translations";
import {
  chooseImage,
  getAuth,
  getTranslations,
  serverRedirect,
  templateReplace,
} from "utils";
import {
  checkEpisodesInLibrary,
  checkIfUserFollowShows,
  getShow,
  removeShowsFromLibrary,
  saveShowsToLibrary,
} from "utils/spotifyCalls";

interface PlaylistProps {
  show: SpotifyApi.SingleShowResponse | null;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: ITranslations;
}

const Shows = ({
  show,
}: InferGetServerSidePropsType<
  typeof getServerSideProps
>): ReactElement | null => {
  const [isShowInLibrary, setIsShowInLibrary] = useState(false);
  const { translations } = useTranslations();
  const { setPageDetails, setAllTracks } = useSpotify();
  const { addToast } = useToast();
  const { setElement } = useHeader({
    showOnFixed: false,
  });
  const [savedEpisodes, setSavedEpisodes] = useState<boolean[]>([]);
  useEffect(() => {
    setElement(() => <PlaylistTopBarExtraField uri={show?.uri} />);
  }, [setElement, show?.uri]);

  useEffect(() => {
    async function fetchData() {
      const userFollowThisShow = await checkIfUserFollowShows([show?.id ?? ""]);
      setIsShowInLibrary(!!userFollowThisShow?.[0]);
    }
    fetchData();
  }, [show?.id]);

  useEffect(() => {
    if (!show?.episodes.items) return;
    const episodeIds = show.episodes.items?.map((episode) => episode.id);
    checkEpisodesInLibrary(episodeIds).then((res) => {
      if (res) {
        setSavedEpisodes(res);
      }
    });
  }, [show?.episodes.items]);

  const allTracks: ITrack[] | undefined = useMemo(
    () =>
      show?.episodes.items.map((episode) => ({
        album: {
          id: show.id,
          name: show.name,
          images: show.images,
          release_date: episode?.release_date,
          type: "show",
          uri: show.uri,
        },
        artists: [
          {
            name: show.name ?? show.publisher ?? "",
            id: show.id ?? "",
            type: "show",
            uri: `spotify:show:${show.id}`,
          },
        ],
        id: episode?.id,
        name: episode?.name,
        duration_ms: episode?.duration_ms ?? 0,
        explicit: episode?.explicit ?? false,
        preview_url: episode?.audio_preview_url,
        position: 1,
        type: "episode",
        uri: episode?.uri,
        description: episode.description,
      })),
    [show]
  );

  useEffect(() => {
    setAllTracks(allTracks ?? []);
  }, [allTracks, setAllTracks]);

  useEffect(() => {
    setPageDetails({
      id: show?.id,
      images: show?.images,
      name: show?.name,
      tracks: {
        total: show?.episodes.total,
      },
      type: "playlist",
      uri: show?.uri,
    });
  }, [setPageDetails, show]);

  if (!show) {
    return null;
  }

  return (
    <ContentContainer hasPageHeader>
      <PageHeader
        key={show?.uri}
        type={HeaderType.Podcast}
        title={show?.name ?? ""}
        coverImg={chooseImage(show?.images, 300).url}
        ownerDisplayName={show?.publisher ?? ""}
        ownerId={show?.id ?? ""}
      />
      <section>
        <div className="options">
          <PlayButton
            uri={show?.uri}
            size={56}
            centerSize={28}
            allTracks={allTracks ?? []}
          />
          <div className="info">
            <Heart
              active={isShowInLibrary}
              style={{ width: 80, height: 80 }}
              handleLike={async () => {
                if (!show) return null;
                const saveRes = await saveShowsToLibrary([show.id]);
                if (saveRes) {
                  addToast({
                    message: templateReplace(
                      translations.toastMessages.typeAddedTo,
                      [
                        translations.contentType.podcast,
                        translations.contentType.library,
                      ]
                    ),
                    variant: "success",
                  });
                  return true;
                }
                return null;
              }}
              handleDislike={async () => {
                if (!show) return null;
                const removeRes = await removeShowsFromLibrary([show.id]);
                if (removeRes) {
                  addToast({
                    message: templateReplace(
                      translations.toastMessages.typeRemovedFrom,
                      [
                        translations.contentType.podcast,
                        translations.contentType.library,
                      ]
                    ),
                    variant: "success",
                  });
                  return true;
                }
                return null;
              }}
            />
          </div>
        </div>
        <div className="content">
          <div className="episodes">
            <Heading number={3} as={AsType.H3}>
              {translations.pages.episode.allEpisodes}
            </Heading>
            <div>
              {allTracks?.map((track, i) => {
                return (
                  <EpisodeCard
                    key={track.id}
                    track={track}
                    position={i}
                    savedEpisode={savedEpisodes[i]}
                  />
                );
              })}
            </div>
          </div>
          <div className="description">
            <Heading number={3} as="h2">
              {translations.pages.episode.about}
            </Heading>
            <p>{show?.description}</p>
          </div>
        </div>
      </section>
      <style jsx>{`
        .content {
          display: grid;
          grid-template-columns: 700px 1fr;
        }
        .episodes {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        section {
          margin: 0 32px;
          position: relative;
          z-index: 1;
        }
        div.info {
          align-self: flex-end;
          width: calc(100% - 310px);
        }
        .info :global(button) {
          margin-left: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: none;
        }
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          flex-direction: row;
        }
        p {
          font-size: 1rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          box-sizing: border-box;
          color: #ffffffb3;
          font-family: "Lato", sans-serif;
        }
        @media (max-width: 768px) {
          .options {
            padding: 32px;
          }
        }
      `}</style>
    </ContentContainer>
  );
};

export default Shows;

export const getServerSideProps = (async (context) => {
  const show = context.params?.show;
  const translations = getTranslations(context);
  const cookies = context.req?.headers?.cookie;
  if (!cookies || !show) {
    serverRedirect(context.res, "/");
    return { props: {} };
  }
  const { user } = (await getAuth(context)) ?? {};

  const showData = await getShow(show, context);

  return {
    props: {
      show: showData,
      user: user ?? null,
      translations,
    },
  };
}) satisfies GetServerSideProps<Partial<PlaylistProps>, { show: string }>;
