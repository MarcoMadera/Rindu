import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import useAuth from "hooks/useAuth";
import Link from "next/link";
import { Fragment, ReactElement, useState } from "react";
import { getMainColorFromImage } from "utils/getMainColorFromImage";

export default function FirstTrackContainer({
  preview,
  track,
  backgroundColor,
}: {
  preview: string | null;
  track: SpotifyApi.TrackObjectFull;
  backgroundColor?: string;
}): ReactElement {
  const [containerColor, setContainerColor] = useState<string | undefined>(
    backgroundColor
  );
  const { user } = useAuth();
  const isPremium = user?.product === "premium";
  const isPlayable =
    (!isPremium && preview) ||
    (isPremium && !(track?.is_playable === false) && !track.is_local);
  return (
    <div className="firstTrack-Container">
      <div className="bg-12"></div>
      <Link href={`/track/${track.id}`}>
        <a className="firstTrack">
          {isPlayable ? (
            <PlayButton size={60} centerSize={24} track={track} isSingle />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={track.album.images[1].url}
            width={100}
            height={100}
            alt=""
            id="cover-image"
            onLoad={() => {
              if (backgroundColor) return;
              setContainerColor(getMainColorFromImage("cover-image"));
            }}
          />
          <h3>{track.name}</h3>
          <span>
            {track.artists?.map((artist, i) => {
              return (
                <Fragment key={artist.id}>
                  <Link href={`/artist/${artist.id}`}>
                    <a className="link">{artist.name}</a>
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
        img {
          box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
        }
        .firstTrack {
          text-decoration: none;
          color: inherit;
          display: block;
          width: 100%;
          height: 100%;
          padding: 20px;
          position: relative;
          z-index: 2;
        }
        .bg-12 {
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.6) 0,
              rgba(0, 0, 0, 0.6) 100%
            ),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          height: 232px;
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
          border-radius: 4px;
          background-color: ${backgroundColor || containerColor || "#181818"};
        }
        .firstTrack-Container {
          background: ${backgroundColor || containerColor || "#181818"};
          border-radius: 4px;
          flex: 1;
          isolation: isolate;
          position: relative;
          transition: background-color 0.3s ease;
          width: 100%;
          height: 260px;
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
          max-width: 80%;
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
          max-width: 80%;
        }
        .firstTrack-Container a {
          color: #b3b3b3;
          text-decoration: none;
        }
        .firstTrack-Container .link:hover,
        .firstTrack-Container .link:focus {
          text-decoration: none;
          color: #fff;
        }
        .firstTrack-Container :global(.play-Button) {
          position: absolute;
          top: 58%;
          left: 79%;
        }
      `}</style>
    </div>
  );
}
