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

export function NavbarLeft({
  currrentlyPlaying,
}: {
  currrentlyPlaying: normalTrackTypes;
}): ReactElement {
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);
  const [isLikedTrack, setIsLikedTrack] = useState(false);
  const { accessToken } = useAuth();
  const { playedSource, isShowingSideBarImg, setIsShowingSideBarImg } =
    useSpotify();
  const { addToast } = useToast();

  useEffect(() => {
    if (!currrentlyPlaying?.id) return;
    checkTracksInLibrary([currrentlyPlaying?.id], accessToken || "").then(
      (res) => {
        setIsLikedTrack(!!res?.[0]);
      }
    );
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
        <Link href={`/track/${currrentlyPlaying.id}`}>
          <a>{currrentlyPlaying.name}</a>
        </Link>
        <span className="trackArtists">
          {currrentlyPlaying.artists?.map((artist, i) => {
            return (
              <Fragment key={artist.id ?? getIdFromUri(artist?.uri)}>
                <Link
                  href={`/artist/${artist.id ?? getIdFromUri(artist?.uri)}`}
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
        className="like-button"
        onMouseEnter={() => {
          setIsHoveringHeart(true);
        }}
        onMouseLeave={() => {
          setIsHoveringHeart(false);
        }}
        onClick={() => {
          if (isLikedTrack) {
            removeTracksFromLibrary(
              [currrentlyPlaying.id ?? ""],
              accessToken
            ).then((res) => {
              if (res) {
                setIsLikedTrack(false);
                addToast({
                  variant: "success",
                  message: "Track removed from library.",
                });
              }
            });
          } else {
            saveTracksToLibrary([currrentlyPlaying.id ?? ""], accessToken).then(
              (res) => {
                if (res) {
                  setIsLikedTrack(true);
                  addToast({
                    variant: "success",
                    message: "Track added to library",
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
      <style jsx>{`
        .img-container {
          display: ${isShowingSideBarImg ? "none" : "block"};
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
        p.trackName {
          color: #fff;
          margin: 0;
          padding: 0;
        }
        span.trackArtists {
          font-size: 14px;
        }
        .like-button {
          background: transparent;
          border: none;
          outline: none;
          margin: 0 10px;
        }
        p,
        span {
          margin: 0px;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          -webkit-line-clamp: 1;
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
      `}</style>
    </div>
  );
}
