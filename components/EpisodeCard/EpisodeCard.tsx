import { ReactElement, useEffect, useState } from "react";

import Link from "next/link";

import { ExplicitSign, Heading } from "components";
import { Add, Pause, Play, Share, ThreeDots } from "components/icons";
import {
  useAuth,
  useContextMenu,
  useSpotify,
  useToast,
  useTranslations,
} from "hooks";
import { AsType } from "types/heading";
import { ITrack } from "types/spotify";
import {
  chooseImage,
  formatTime,
  getIdFromUri,
  getSiteUrl,
  getTimeAgo,
  handlePlayCurrentTrackError,
  playCurrentTrack,
  templateReplace,
} from "utils";
import {
  removeEpisodesFromLibrary,
  saveEpisodesToLibrary,
} from "utils/spotifyCalls";

interface EpisodeCardProps {
  track: ITrack | undefined;
  position: number;
  savedEpisode: boolean;
}

export default function EpisodeCard({
  track,
  position,
  savedEpisode,
}: Readonly<EpisodeCardProps>): ReactElement | null {
  const {
    isPlaying,
    currentlyPlaying,
    deviceId,
    player,
    allTracks,
    pageDetails,
    setCurrentlyPlaying,
    setPlaylistPlayingId,
    setReconnectionError,
    setPlayedSource,
  } = useSpotify();
  const { isPremium } = useAuth();
  const { addToast } = useToast();
  const { addContextMenu } = useContextMenu();
  const isThisEpisodePlaying = currentlyPlaying?.uri === track?.uri;
  const [isEpisodeInLibrary, setIsEpisodeInLibrary] = useState<boolean>(
    savedEpisode ?? false
  );
  const [shouldUpdateList, setShouldUpdateList] = useState<boolean>(false);
  const { translations, locale } = useTranslations();
  useEffect(() => {
    setIsEpisodeInLibrary(savedEpisode);
    setShouldUpdateList(true);
  }, [savedEpisode]);

  useEffect(() => {
    if (shouldUpdateList) {
      setShouldUpdateList(false);
    }
  }, [shouldUpdateList]);

  if (!track) return null;

  async function playThisTrack() {
    try {
      await playCurrentTrack(
        {
          position: track?.position,
          preview_url: track?.preview_url,
          uri: track?.uri,
        },
        {
          player,
          isPremium,
          allTracks,
          deviceId,
          playlistUri: pageDetails?.uri,
          isSingleTrack: true,
          position,
        }
      );

      if (!isPremium) {
        setCurrentlyPlaying(track);
      }

      const source = pageDetails?.uri;
      const isCollection = source?.split(":")?.[3];
      setPlaylistPlayingId(undefined);
      const id = getIdFromUri(pageDetails?.uri, "id");
      setPlayedSource(
        isCollection && pageDetails?.type && id
          ? `spotify:${pageDetails.type}:${id}`
          : source ?? track?.uri
      );
    } catch (error) {
      handlePlayCurrentTrackError(error, {
        addToast,
        player: player as Spotify.Player,
        setReconnectionError,
        translations,
      });
    }
  }

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        addContextMenu({
          type: "cardTrack",
          data: track,
          position: { x, y },
        });
      }}
    >
      <hr />
      <div className="episodeCard">
        <div className="coverImage">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chooseImage(track.album?.images, 112).url}
              alt={track.name}
            />
          </div>
        </div>
        <div className="header">
          <Link href={`/episode/${track.id}`}>
            <Heading number={5} as={AsType.SPAN}>
              {track.name}
            </Heading>
          </Link>
        </div>
        <div className="description">
          <p>{track.description}</p>
        </div>
        <div className="metadata">
          <div>
            <p>
              {track.explicit ? <ExplicitSign /> : null}{" "}
              {track?.album?.release_date
                ? getTimeAgo(+new Date(track?.album?.release_date), locale)
                : null}
            </p>
            <p>
              {track?.duration_ms ? (
                <span>{formatTime(track.duration_ms / 1000)}</span>
              ) : null}
            </p>
          </div>
        </div>
        <div className="actions">
          <Add
            fill="#ffffffb3"
            isAdded={isEpisodeInLibrary}
            shouldUpdateList={shouldUpdateList}
            handleClick={async () => {
              if (!track?.id) return false;
              if (isEpisodeInLibrary) {
                const removeEpisodeRes = await removeEpisodesFromLibrary([
                  track?.id,
                ]);
                if (removeEpisodeRes) {
                  addToast({
                    message: templateReplace(
                      translations.toastMessages.typeRemovedFrom,
                      [
                        translations.contentType.episode,
                        translations.contentType.library,
                      ]
                    ),
                    variant: "success",
                  });
                  setIsEpisodeInLibrary(false);
                  return false;
                }
                return true;
              } else {
                const saveEpisodesToLibraryRes = await saveEpisodesToLibrary([
                  track.id,
                ]);
                if (saveEpisodesToLibraryRes) {
                  addToast({
                    message: templateReplace(
                      translations.toastMessages.typeAddedTo,
                      [
                        translations.contentType.episode,
                        translations.contentType.library,
                      ]
                    ),
                    variant: "success",
                  });
                  setIsEpisodeInLibrary(true);
                  return true;
                }
                return false;
              }
            }}
          />
          <button
            type="button"
            aria-label="Share"
            onClick={() => {
              try {
                navigator.clipboard.writeText(
                  `${getSiteUrl()}/episode/${track.id}`
                );
                addToast({
                  message: translations.toastMessages.copiedToClipboard,
                  variant: "success",
                });
              } catch {
                addToast({
                  message: translations.toastMessages.failedToCopyToClipboard,
                  variant: "error",
                });
              }
            }}
          >
            <Share fill="#ffffffb3" />
          </button>
          <button
            type="button"
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const x = e.pageX;
              const y = e.pageY;
              addContextMenu({
                type: "cardTrack",
                data: track,
                position: { x, y },
              });
            }}
          >
            <ThreeDots fill="#ffffffb3" width={24} height={24} />
          </button>
        </div>
        <div className="play">
          <button
            type="button"
            onClick={() => {
              if (isThisEpisodePlaying) {
                player?.togglePlay();
                return;
              }
              if (isPremium) {
                (player as Spotify.Player)?.activateElement();
              }
              playThisTrack();
            }}
          >
            {isThisEpisodePlaying && isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>
      <style jsx>{`
        .episodeCard {
          align-items: center;
          display: grid;
          grid-template-areas:
            "coverImage header header header topActions"
            "coverImage description description description description"
            "coverImage play metadata actions actions";
          grid-template-columns: min-content min-content 1fr min-content;
          grid-template-rows: auto;
          border-radius: 4px;
          color: #ffffffb3;
          cursor: pointer;
          margin: 0px -16px;
          padding: 16px;
          max-width: 700px;
        }
        .episodeCard:hover,
        .episodeCard:focus-within {
          background-color: rgba(255, 255, 255, 0.1);
        }
        hr {
          border-color: hsla(0, 0%, 100%, 0.1);
          max-width: calc(100% - 32px);
        }
        .coverImage {
          grid-area: coverImage;
          align-self: flex-start;
        }
        .coverImage img {
          box-shadow: rgb(0 0 0 / 50%) 0px 4px 60px;
          height: 100%;
          width: 100%;
          border-radius: 8px;
          object-fit: cover;
          object-position: center center;
        }
        .coverImage div {
          margin: 0px 24px 0px 0px;
          width: 112px;
          height: 112px;
        }
        .header {
          grid-area: header;
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .header :global(a) {
          color: #fff;
          text-decoration: none;
        }
        .header :global(a:hover) {
          text-decoration: underline;
        }
        .description {
          grid-area: description;
        }
        .description p {
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          margin: 12px 0px;
          overflow: hidden;
          padding: 0px;
          word-break: break-word;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
          text-transform: none;
        }
        .metadata {
          grid-area: metadata;
          margin: 0px 0px 0px 16px;
          display: flex;
          gap: 8px;
        }
        .metadata div {
          align-items: center;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
        }
        .metadata p {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 14px;
          text-transform: none;
          margin: 0px;
        }
        .metadata div p:nth-of-type(2)::before {
          content: "·";
          margin: 0px 4px;
        }
        .metadata span {
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
        }
        .episodeCard:hover .topActions button {
          opacity: 1;
        }
        .actions {
          grid-area: actions;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1.2rem;
        }
        .actions :global(button) {
          background-color: transparent;
          border: 0;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          padding: 0;
          opacity: 0;
          font-family: "Lato";
          transition: opacity 0.2s ease-in-out;
          display: flex;
          align-items: center;
        }
        .actions :global(button:hover) {
          color: #fff;
        }
        .episodeCard:hover .actions :global(button) {
          opacity: 1;
        }
        .play {
          grid-area: play;
        }
        .play button {
          border-radius: 50%;
          background-color: #fff;
          border: none;
          display: flex;
          font-size: 8px;
          justify-content: center;
          height: 32px;
          min-height: 32px;
          min-width: 32px;
          width: 32px;
          justify-content: center;
          align-items: center;
        }
        .play button:hover,
        .play button:focus {
          transform: scale(1.1);
        }
        .play button:active {
          transform: scale(1);
        }
      `}</style>
    </div>
  );
}
