import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import useAuth from "hooks/useAuth";
import useContextMenu from "hooks/useContextMenu";
import useOnScreen from "hooks/useOnScreen";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useRef, useState } from "react";
import { getMainColorFromImage } from "utils/getMainColorFromImage";

export default function FirstTrackContainer({
  preview,
  track,
  backgroundColor,
  position,
}: {
  preview: string | null;
  track: SpotifyApi.TrackObjectFull;
  backgroundColor?: string;
  position?: number;
}): ReactElement {
  const [containerColor, setContainerColor] = useState<string | undefined>(
    backgroundColor
  );
  const { user } = useAuth();
  const { addContextMenu } = useContextMenu();
  const isPremium = user?.product === "premium";
  const isPlayable =
    (!isPremium && preview) ||
    (isPremium && !(track?.is_playable === false) && !track.is_local);
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const isVisible = useOnScreen(cardRef, "-60px");

  useEffect(() => {
    if ((image.current?.complete || imageIsLoaded) && backgroundColor) {
      if (backgroundColor) return;
      setContainerColor(getMainColorFromImage(`cover-image-${track.id}`));
    }
  }, [backgroundColor, imageIsLoaded, router.asPath, track.id]);

  return (
    <div
      className="firstTrack-Container"
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
      <div className="bg-12"></div>
      <Link href={`/track/${track.id}`}>
        <a
          className="firstTrack"
          ref={cardRef}
          aria-hidden={isVisible ? "false" : "true"}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={isVisible ? 0 : -1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={track.album.images[1].url}
            width={100}
            height={100}
            alt=""
            ref={image}
            id={`cover-image-${track.id}`}
            onLoad={() => {
              if (backgroundColor) return;
              setContainerColor(
                getMainColorFromImage(`cover-image-${track.id}`)
              );
              setImageIsLoaded(true);
            }}
          />
          <h3>{track.name}</h3>
        </a>
      </Link>
      {isPlayable ? (
        <PlayButton
          size={60}
          centerSize={28}
          track={track}
          position={position}
        />
      ) : null}
      <div className="artists">
        <span>
          {track.artists?.map((artist, i) => {
            return (
              <Fragment key={artist.id}>
                <Link href={`/artist/${artist.id}`}>
                  <a
                    className="link"
                    aria-hidden={isVisible ? "false" : "true"}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    tabIndex={isVisible ? 0 : -1}
                  >
                    {artist.name}
                  </a>
                </Link>
                {i !== (track.artists?.length && track.artists?.length - 1)
                  ? ", "
                  : null}
              </Fragment>
            );
          })}
        </span>
      </div>
      <style jsx>{`
        img {
          box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
          position: relative;
          z-index: 32293;
        }
        .firstTrack {
          text-decoration: none;
          color: inherit;
          display: block;
          width: 100%;
          height: 100%;
          padding: 20px;
          position: relative;
          z-index: 2323223;
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
          border-radius: 16px;
          background-color: ${backgroundColor || containerColor || "#7a7a7a"};
          transition: background-color 0.3s ease;
        }
        .firstTrack-Container {
          background: ${backgroundColor || containerColor || "#7a7a7a"};
          border-radius: 16px;
          flex: 1;
          isolation: isolate;
          position: relative;
          transition: background-color 0.3s ease;
          width: 100%;
          height: 260px;
        }
        .artists {
          position: absolute;
          z-index: 10;
          width: 100%;
          bottom: 50px;
          left: 20px;
          max-width: 80%;
          width: fit-content;
          z-index: 32323231;
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
          display: inline;
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
          position: relative;
          z-index: 3294343;
        }
        .firstTrack-Container a {
          color: #b3b3b3;
          text-decoration: none;
        }
        .firstTrack-Container .link:hover,
        .firstTrack-Container .link:focus {
          text-decoration: underline;
          color: #fff;
        }
        .firstTrack-Container :global(.play-Button) {
          position: absolute;
          bottom: 50px;
          right: 50px;
          z-index: 32323232;
        }
      `}</style>
    </div>
  );
}
