import { ReactElement, useEffect, useState } from "react";

import Link from "next/link";

import { ArtistList, PictureInPictureButton, ScrollableText } from "components";
import { Chevron, Heart } from "components/icons";
import { useContextMenu, useSpotify, useToast, useTranslations } from "hooks";
import { chooseImage, templateReplace } from "utils";
import {
  checkEpisodesInLibrary,
  checkTracksInLibrary,
  removeEpisodesFromLibrary,
  removeTracksFromLibrary,
  saveEpisodesToLibrary,
  saveTracksToLibrary,
} from "utils/spotifyCalls";

export default function NowPlaying(): ReactElement | null {
  const [isLikedTrack, setIsLikedTrack] = useState(false);
  const {
    playedSource,
    isShowingSideBarImg,
    setIsShowingSideBarImg,
    currentlyPlaying,
  } = useSpotify();
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const { addContextMenu } = useContextMenu();
  const type = playedSource?.split(":")?.[1];
  const id = playedSource?.split(":")?.[2];

  useEffect(() => {
    if (!currentlyPlaying?.id) return;
    const checkInLibrary =
      currentlyPlaying.type === "episode"
        ? checkEpisodesInLibrary
        : checkTracksInLibrary;
    checkInLibrary([currentlyPlaying.id]).then((res) => {
      setIsLikedTrack(!!res?.[0]);
    });
  }, [currentlyPlaying?.id, currentlyPlaying?.type]);

  if (!currentlyPlaying) return null;

  return (
    <div
      className={`${
        isShowingSideBarImg ? "navBar-left hide" : "navBar-left show"
      }`}
    >
      <div className="img-container">
        <button
          type="button"
          aria-label="Maximize cover image"
          onClick={(e) => {
            e.stopPropagation();
            setIsShowingSideBarImg(true);
          }}
          className="show-img"
        >
          <Chevron rotation={"90deg"} />
        </button>
        {playedSource && type && id ? (
          <Link href={`/${type}/${id}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chooseImage(currentlyPlaying.album?.images, 64).url}
              alt={currentlyPlaying.album?.name}
              width={64}
              height={64}
              id="playing-now-cover"
            />
          </Link>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chooseImage(currentlyPlaying.album?.images, 64).url}
              alt={currentlyPlaying.album?.name}
              width={64}
              height={64}
            />
          </>
        )}
      </div>
      <section>
        {currentlyPlaying.id ? (
          <Link
            href={`/${currentlyPlaying.type ?? "track"}/${currentlyPlaying.id}`}
            className="trackName"
            onContextMenu={(e) => {
              e.preventDefault();
              const x = e.pageX;
              const y = e.pageY;
              addContextMenu({
                type: "cardTrack",
                data: currentlyPlaying,
                position: { x, y },
              });
            }}
          >
            <ScrollableText>{currentlyPlaying.name}</ScrollableText>
          </Link>
        ) : (
          <ScrollableText>{currentlyPlaying.name}</ScrollableText>
        )}
        <ScrollableText>
          <span className="trackArtists">
            <ArtistList artists={currentlyPlaying.artists} />
          </span>
        </ScrollableText>
      </section>
      {!currentlyPlaying.is_local && (
        <Heart
          active={isLikedTrack}
          className="navBar-Button"
          handleDislike={async () => {
            const removeFromLibrary =
              currentlyPlaying.type === "episode"
                ? removeEpisodesFromLibrary
                : removeTracksFromLibrary;
            const res = await removeFromLibrary([currentlyPlaying.id ?? ""]);

            if (res) {
              addToast({
                variant: "success",
                message: templateReplace(
                  translations.toastMessages.typeRemovedFrom,
                  [
                    `${
                      currentlyPlaying.type === "episode"
                        ? translations.contentType.episode
                        : translations.contentType.track
                    }`,
                    translations.contentType.library,
                  ]
                ),
              });
              return true;
            }
            return null;
          }}
          handleLike={async () => {
            const saveToLibrary =
              currentlyPlaying.type === "episode"
                ? saveEpisodesToLibrary
                : saveTracksToLibrary;
            const saveRes = await saveToLibrary([currentlyPlaying.id ?? ""]);
            if (saveRes) {
              addToast({
                variant: "success",
                message: templateReplace(
                  translations.toastMessages.typeAddedTo,
                  [
                    `${
                      currentlyPlaying.type === "episode"
                        ? translations.contentType.episode
                        : translations.contentType.track
                    }`,
                    translations.contentType.library,
                  ]
                ),
              });
              return true;
            }
            return null;
          }}
        />
      )}
      {!!document?.pictureInPictureEnabled && <PictureInPictureButton />}
      <style jsx>{`
        section {
          margin-right: 10px;
          max-width: 310px;
          min-width: 100px;
          overflow: hidden;
          position: relative;
        }
        .img-container {
          display: block;
          position: relative;
          margin-right: 8px;
        }
        .img-container:hover .show-img {
          opacity: 1;
        }
        .show-img {
          position: absolute;
          opacity: 0;
          top: 5px;
          right: 5px;
          width: 24px;
          height: 24px;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1;
          cursor: auto;
          border: none;
          border-radius: 50%;
          color: #ffffffb3;
        }
        .show-img:hover {
          transform: scale(1.1);
        }
        span.trackArtists {
          font-size: 12px;
          color: #ffffffb3;
        }
        .navBar-Button {
          background: transparent;
          border: none;
          outline: none;
          margin: 0 10px;
          color: #ffffffb3;
        }
        .navBar-Button:hover,
        section :global(a.trackName) {
          color: #fff;
        }
        p,
        span {
          margin: 0px;
          text-align: left;
        }
        .navBar-left :global(a.trackName) {
          text-decoration: none;
          color: inherit;
        }
        .navBar-left :global(a.trackName:hover) {
          color: #fff;
          text-decoration: underline;
        }
        .navBar-left {
          width: 100%;
          height: 65px;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
          cursor: default;
          user-select: none;
        }
        img {
          margin: 0;
          padding: 0;
        }
        .hide {
          animation: slide-out-top 0.1s linear both;
        }
        .show {
          animation: slide-in-right 0.1s linear both;
        }
        @keyframes slide-out-top {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(-40px);
            opacity: 1;
          }
          100% {
            transform: translateX(-80px);
            opacity: 1;
          }
        }
        @keyframes slide-in-right {
          0% {
            transform: translateX(-40px);
            opacity: 1;
          }
          100% {
            transform: translateX(0px);
            opacity: 1;
          }
        }
        @media (max-width: 685px) {
          section {
            max-width: 200px;
          }
          .navBar-left :global(.navBar-Button) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
