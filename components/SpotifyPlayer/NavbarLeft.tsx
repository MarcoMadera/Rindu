import { Fragment, ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { normalTrackTypes } from "types/spotify";
import { Heart, HeartShape } from "components/icons/Heart";
import { removeTracksFromLibrary } from "utils/spotifyCalls/removeTracksFromLibrary";
import { saveTracksToLibrary } from "utils/spotifyCalls/saveTracksToLibrary";
import useAuth from "hooks/useAuth";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { getIdFromUri } from "utils/getIdFromUri";
import useSpotify from "hooks/useSpotify";
import { Chevron } from "components/icons/Chevron";
import useToast from "hooks/useToast";
import { checkEpisodesInLibrary } from "utils/spotifyCalls/checkEpisodesInLibrary";
import { removeEpisodesFromLibrary } from "utils/spotifyCalls/removeEpisodesFromLibrary";
import { saveEpisodesToLibrary } from "utils/spotifyCalls/saveEpisodesToLibrary";
import { callPictureInPicture } from "utils/callPictureInPicture";
import { PictureInPicture } from "components/icons/PictureInPicture";
import useContextMenu from "hooks/useContextMenu";

export function NavbarLeft({
  currrentlyPlaying,
}: {
  currrentlyPlaying: normalTrackTypes;
}): ReactElement {
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);
  const [isLikedTrack, setIsLikedTrack] = useState(false);
  const { accessToken } = useAuth();
  const {
    playedSource,
    isShowingSideBarImg,
    setIsShowingSideBarImg,
    pictureInPictureCanvas,
    videoRef,
    setIsPip,
    isPip,
  } = useSpotify();
  const { addToast } = useToast();
  const { addContextMenu } = useContextMenu();
  const [hideImg, setHideImg] = useState(false);

  useEffect(() => {
    if (!isShowingSideBarImg) {
      return setHideImg(false);
    }
    const timer = setTimeout(() => {
      setHideImg(true);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [isShowingSideBarImg]);

  useEffect(() => {
    if (!currrentlyPlaying?.id) return;
    const checkInLibrary =
      currrentlyPlaying?.type === "episode"
        ? checkEpisodesInLibrary
        : checkTracksInLibrary;
    checkInLibrary([currrentlyPlaying?.id], accessToken || "").then((res) => {
      setIsLikedTrack(!!res?.[0]);
    });
  }, [accessToken, currrentlyPlaying]);

  const type = playedSource?.split(":")?.[1];
  const id = playedSource?.split(":")?.[2];

  return (
    <div className="navBar-left">
      <div className="img-container">
        <button
          onClick={() => {
            setIsShowingSideBarImg(true);
          }}
          className="show-img"
        >
          <Chevron rotation={"90deg"} />
        </button>
        {playedSource ? (
          <Link href={`/${type}/${id}`}>
            <a>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`${isShowingSideBarImg ? "hide" : ""}`}
                src={
                  currrentlyPlaying.album.images[2]?.url ??
                  currrentlyPlaying.album.images[1]?.url
                }
                alt={currrentlyPlaying.album.name}
                width={64}
                height={64}
              />
            </a>
          </Link>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${isShowingSideBarImg ? "hide" : ""}`}
              src={
                currrentlyPlaying.album.images[2]?.url ??
                currrentlyPlaying.album.images[1]?.url
              }
              alt={currrentlyPlaying.album.name}
              width={64}
              height={64}
            />
          </>
        )}
      </div>
      <section>
        <Link
          href={`/${currrentlyPlaying?.type ?? "track"}/${
            currrentlyPlaying?.id
          }`}
        >
          <a
            className="trackName"
            onContextMenu={(e) => {
              e.preventDefault();
              const x = e.pageX;
              const y = e.pageY;
              addContextMenu({
                type: "cardTrack",
                data: currrentlyPlaying,
                position: { x, y },
              });
            }}
          >
            {currrentlyPlaying.name}
          </a>
        </Link>
        <span className="trackArtists">
          {currrentlyPlaying.artists?.map((artist, i) => {
            return (
              <Fragment key={artist.id ?? getIdFromUri(artist?.uri, "id")}>
                <Link
                  href={`/${getIdFromUri(artist?.uri, "type") ?? "artist"}/${
                    artist.id ?? getIdFromUri(artist?.uri, "id")
                  }`}
                >
                  <a>{artist.name}</a>
                </Link>
                {i !==
                (currrentlyPlaying.artists?.length &&
                  currrentlyPlaying.artists?.length - 1)
                  ? ", "
                  : null}
              </Fragment>
            );
          })}
        </span>
      </section>
      <button
        className="navBar-Button"
        onMouseEnter={() => {
          setIsHoveringHeart(true);
        }}
        onMouseLeave={() => {
          setIsHoveringHeart(false);
        }}
        onClick={() => {
          const removeFromLibrary =
            currrentlyPlaying?.type === "episode"
              ? removeEpisodesFromLibrary
              : removeTracksFromLibrary;
          if (isLikedTrack) {
            removeFromLibrary([currrentlyPlaying.id ?? ""], accessToken).then(
              (res) => {
                if (res) {
                  setIsLikedTrack(false);
                  addToast({
                    variant: "success",
                    message: `${
                      currrentlyPlaying.type === "episode" ? "Episode" : "Song"
                    } removed from library.`,
                  });
                }
              }
            );
          } else {
            const saveToLibrary =
              currrentlyPlaying.type === "episode"
                ? saveEpisodesToLibrary
                : saveTracksToLibrary;
            saveToLibrary([currrentlyPlaying.id ?? ""], accessToken).then(
              (res) => {
                if (res) {
                  setIsLikedTrack(true);
                  addToast({
                    variant: "success",
                    message: `${
                      currrentlyPlaying.type === "episode" ? "Episode" : "Song"
                    } added to library`,
                  });
                }
              }
            );
          }
        }}
      >
        {isLikedTrack ? (
          <Heart />
        ) : !currrentlyPlaying.is_local ? (
          <HeartShape fill={isHoveringHeart ? "#fff" : "#ffffffb3"} />
        ) : null}
      </button>
      <button
        className="navBar-Button pictureInPicture"
        onClick={() => {
          if (pictureInPictureCanvas.current && videoRef.current) {
            if (isPip && document.pictureInPictureElement) {
              setIsPip(false);
              document.exitPictureInPicture();
            } else {
              callPictureInPicture(
                pictureInPictureCanvas.current,
                videoRef.current
              );
              setIsPip(true);
            }
          }
        }}
      >
        <PictureInPicture />
      </button>
      <style jsx>{`
        .navBar-Button.pictureInPicture {
          color: ${isPip ? "#1db954" : "#ffffffb3"};
        }
        .img-container {
          display: ${hideImg ? "none" : "block"};
          position: relative;
          margin-right: 23px;
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
        }
        .navBar-Button {
          background: transparent;
          border: none;
          outline: none;
          margin: 0 10px;
          color: #ffffffb3;
        }
        .navBar-Button.pictureInPicture:hover,
        .navBar-Button:hover {
          color: #fff;
        }
        p,
        span,
        .trackName {
          margin: 0px;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          -webkit-line-clamp: 1;
        }
        .trackName {
          -webkit-line-clamp: 2;
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
          animation: slide-out-top 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)
            both;
        }
        @keyframes slide-out-top {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
