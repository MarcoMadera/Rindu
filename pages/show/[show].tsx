import { useEffect, useMemo, useState } from "react";

import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

import {
  ContentContainer,
  EpisodeCard,
  Heading,
  PageHeader,
  PlayButton,
  PlaylistTopBarExtraField,
} from "components";
import { Heart } from "components/icons";
import {
  useAuth,
  useHeader,
  useSpotify,
  useToast,
  useTranslations,
} from "hooks";
import { AsType } from "types/heading";
import { HeaderType } from "types/pageHeader";
import { ITrack } from "types/spotify";
import {
  chooseImage,
  ContentType,
  getAuth,
  getTranslations,
  Page,
  serverRedirect,
  templateReplace,
  ToastMessage,
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
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
  translations: Record<string, string>;
}

const Shows: NextPage<PlaylistProps> = ({ show }) => {
  const [isShowInLibrary, setIsShowInLibrary] = useState(false);
  const { accessToken } = useAuth();
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
      const userFollowThisShow = await checkIfUserFollowShows(
        [show?.id || ""],
        accessToken
      );
      setIsShowInLibrary(!!userFollowThisShow?.[0]);
    }
    fetchData();
  }, [accessToken, show?.id]);

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

  return (
    <ContentContainer hasPageHeader>
      <PageHeader
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
            allTracks={allTracks || []}
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
                      translations[ToastMessage.TypeAddedTo],
                      [
                        translations[ContentType.Podcast],
                        translations[ContentType.Library],
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
                      translations[ToastMessage.TypeRemovedFrom],
                      [
                        translations[ContentType.Podcast],
                        translations[ContentType.Library],
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
              {translations.allEpisodes}
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
              {translations.about}
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

export async function getServerSideProps({
  params: { show },
  req,
  res,
  query,
}: {
  params: { show: string };
  req: NextApiRequest;
  res: NextApiResponse;
  query: NextParsedUrlQuery;
}): Promise<{
  props: PlaylistProps | null;
}> {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Episode);
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const showData = await getShow(show, accessToken);

  return {
    props: {
      show: showData,
      accessToken,
      user: user ?? null,
      translations,
    },
  };
}
