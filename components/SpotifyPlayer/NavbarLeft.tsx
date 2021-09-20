import { Fragment, ReactElement } from "react";
import Link from "next/link";
import { normalTrackTypes } from "types/spotify";

export function NavbarLeft({
  currrentlyPlaying,
}: {
  currrentlyPlaying: normalTrackTypes;
}): ReactElement {
  return (
    <div>
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
        <p className="trackName">{currrentlyPlaying.name}</p>
        <span className="trackArtists">
          {currrentlyPlaying.artists?.map((artist, i) => {
            return (
              <Fragment key={artist.id}>
                <Link href={`/artist/${artist.id}`}>
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
      <style jsx>{`
        p.trackName {
          color: #fff;
          margin: 0;
          padding: 0;
        }
        span.trackArtists {
          font-size: 14px;
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
