import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "components/icons/Heart";
import { removeTracksFromLibrary } from "utils/spotifyCalls/removeTracksFromLibrary";
import { saveTracksToLibrary } from "utils/spotifyCalls/saveTracksToLibrary";
import useAuth from "hooks/useAuth";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import useSpotify from "hooks/useSpotify";
import { Chevron } from "components/icons/Chevron";
import useToast from "hooks/useToast";
import { checkEpisodesInLibrary } from "utils/spotifyCalls/checkEpisodesInLibrary";
import { removeEpisodesFromLibrary } from "utils/spotifyCalls/removeEpisodesFromLibrary";
import { saveEpisodesToLibrary } from "utils/spotifyCalls/saveEpisodesToLibrary";
import useContextMenu from "hooks/useContextMenu";
import PictureInPictureButton from "./PictureInPictureButton";
import ArtistList from "./ArtistList";
import ScrollableText from "./ScrollableText";

export default function NowPlaying(): ReactElement | null {
  const [isLikedTrack, setIsLikedTrack] = useState(false);
  const { accessToken } = useAuth();
  const {
    playedSource,
    isShowingSideBarImg,
    setIsShowingSideBarImg,
    currentlyPlaying,
  } = useSpotify();
  const { addToast } = useToast();
  const { addContextMenu } = useContextMenu();
  const type = playedSource?.split(":")?.[1];
  const id = playedSource?.split(":")?.[2];

  useEffect(() => {
    if (!currentlyPlaying?.id) return;
    const checkInLibrary =
      currentlyPlaying.type === "episode"
        ? checkEpisodesInLibrary
        : checkTracksInLibrary;
    checkInLibrary([currentlyPlaying.id], accessToken || "").then((res) => {
      setIsLikedTrack(!!res?.[0]);
    });
  }, [accessToken, currentlyPlaying?.id, currentlyPlaying?.type]);

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
          onClick={() => {
            setIsShowingSideBarImg(true);
          }}
          className="show-img"
        >
          <Chevron rotation={"90deg"} />
        </button>
        {playedSource && type && id ? (
          <Link href={`/${type}/${id}`}>
            <a>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  currentlyPlaying.album?.images[2]?.url ??
                  currentlyPlaying.album?.images[1]?.url
                }
                alt={currentlyPlaying.album?.name}
                width={64}
                height={64}
              />
            </a>
          </Link>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                currentlyPlaying.album?.images[2]?.url ??
                currentlyPlaying.album?.images[1]?.url
              }
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
          >
            <a
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
            </a>
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
            const res = await removeFromLibrary(
              [currentlyPlaying.id ?? ""],
              accessToken
            );

            if (res) {
              addToast({
                variant: "success",
                message: `${
                  currentlyPlaying.type === "episode" ? "Episode" : "Song"
                } removed from library.`,
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
            const saveRes = await saveToLibrary(
              [currentlyPlaying.id ?? ""],
              accessToken
            );
            if (saveRes) {
              addToast({
                variant: "success",
                message: `${
                  currentlyPlaying.type === "episode" ? "Episode" : "Song"
                } added to library`,
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
          color: #b3b3b3;
        }
        .show-img:hover {
          transform: scale(1.1);
        }
        span.trackArtists {
          font-size: 12px;
          color: #b3b3b3;
        }
        .navBar-Button {
          background: transparent;
          border: none;
          outline: none;
          margin: 0 10px;
          color: #ffffffb3;
        }
        .navBar-Button:hover,
        .trackName {
          color: #fff;
        }
        p,
        span {
          margin: 0px;
          text-align: left;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        a:hover {
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
        }
      `}</style>
    </div>
  );
}
