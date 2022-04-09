import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import Link from "next/link";
import { Fragment, ReactElement } from "react";

export default function FirstTrackContainer({
  preview,
  track,
  backgroundColor,
}: {
  preview: string | null;
  track: SpotifyApi.TrackObjectFull;
  backgroundColor: string;
}): ReactElement {
  return (
    <div className="firstTrack-Container">
      {preview ? <PlayButton size={60} centerSize={24} track={track} /> : null}
      <Link href={`/album/${track.album.id}`}>
        <a className="firstTrack">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={track.album.images[1].url}
            width={100}
            height={100}
            alt=""
          />
          <h3>{track.name}</h3>
          <span>
            {track.artists?.map((artist, i) => {
              return (
                <Fragment key={artist.id}>
                  <Link href={`/artist/${artist.id}`}>
                    <a>{artist.name}</a>
                  </Link>
                  {i !== (track.artists?.length && track.artists?.length - 1)
                    ? ", "
                    : null}
                </Fragment>
              );
            })}
          </span>
        </a>
      </Link>
      <style jsx>{`
        .firstTrack-Container {
          background: ${backgroundColor};
          border-radius: 4px;
          flex: 1;
          isolation: isolate;
          padding: 20px;
          position: relative;
          transition: background-color 0.3s ease;
          width: 100%;
          height: 260px;
          text-decoration: none;
          color: inherit;
        }
        .firstTrack-Container span {
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          font-size: 1em;
          margin: 0;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
        }
        .firstTrack-Container h3 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 36px;
          text-transform: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
        }
        .firstTrack-Container a {
          color: #b3b3b3;
          text-decoration: none;
        }
        .firstTrack-Container a:hover,
        .firstTrack-Container a:focus {
          text-decoration: none;
          color: #fff;
        }
        .firstTrack-Container :global(.play-Button) {
          position: absolute;
          top: 65%;
          left: 80%;
          transform: translate(-50%, -50%);
        }
        .firstTrack-Container :global(.play-Button:hover),
        .firstTrack-Container :global(.play-Button:focus) {
          transform: translate(-50%, -50%) scale(1.1);
        }
      `}</style>
    </div>
  );
}
