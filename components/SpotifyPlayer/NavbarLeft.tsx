import { Fragment, ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { normalTrackTypes } from "types/spotify";
import { Heart, HeartShape } from "components/icons/Heart";
import { removeTracksFromLibrary } from "utils/spotifyCalls/removeTracksFromLibrary";
import { saveTracksToLibrary } from "utils/spotifyCalls/saveTracksToLibrary";
import useAuth from "hooks/useAuth";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { getIdFromUri } from "utils/getIdFromUri";

export function NavbarLeft({
  currrentlyPlaying,
}: {
  currrentlyPlaying: normalTrackTypes;
}): ReactElement {
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);
  const [isLikedTrack, setIsLikedTrack] = useState(false);
  const { accessToken } = useAuth();
  useEffect(() => {
    if (!currrentlyPlaying?.id) return;
    checkTracksInLibrary([currrentlyPlaying?.id], accessToken || "").then(
      (res) => {
        setIsLikedTrack(!!res?.[0]);
      }
    );
  }, [accessToken, currrentlyPlaying]);

  return (
    <div>
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
              }
            });
          } else {
            saveTracksToLibrary([currrentlyPlaying.id ?? ""], accessToken).then(
              (res) => {
                if (res) {
                  setIsLikedTrack(true);
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
        div {
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
          margin-right: 23px;
        }
      `}</style>
    </div>
  );
}
