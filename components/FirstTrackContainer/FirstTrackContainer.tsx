import { ReactElement, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { ArtistList, Heading, PlayButton } from "components";
import { useAuth, useContextMenu, useOnScreen } from "hooks";
import { ITrack } from "types/spotify";
import { chooseImage, getMainColorFromImage } from "utils";

interface FirstTrackContainerProps {
  preview?: string | null;
  track: ITrack;
  backgroundColor?: string;
  position?: number;
  allTracks: ITrack[];
}

export default function FirstTrackContainer({
  preview,
  track,
  backgroundColor,
  position,
  allTracks,
}: FirstTrackContainerProps): ReactElement | null {
  const [containerColor, setContainerColor] = useState<string>(
    backgroundColor ?? ""
  );
  const { isPremium } = useAuth();
  const { addContextMenu } = useContextMenu();
  const isPlayable =
    (!isPremium && preview) ||
    (isPremium && track?.is_playable !== false && !track?.is_local);
  const router = useRouter();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const isVisible = useOnScreen(cardRef, "-150px");

  useEffect(() => {
    if (backgroundColor || !track?.id) return;
    getMainColorFromImage(`cover-image-${track.id}`, setContainerColor);
  }, [backgroundColor, router.asPath, track?.id]);

  if (!track) return null;

  return (
    <div className="firstTrack-Container-wrapper">
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
        {track.id ? (
          <Link
            href={`/track/${track.id}`}
            className="firstTrack"
            ref={cardRef}
            aria-hidden={isVisible ? "false" : "true"}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={isVisible ? 0 : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chooseImage(track.album?.images, 100).url}
              width={100}
              height={100}
              alt=""
              id={`cover-image-${track.id}`}
            />
            <Heading
              number={2}
              as="h3"
              fontSize="32px"
              margin="1rem 0"
              multiline={1}
            >
              {track.name}
            </Heading>
          </Link>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chooseImage(track.album?.images, 100).url}
              width={100}
              height={100}
              alt=""
              id={"cover-image-"}
            />
            <Heading
              number={2}
              as="h3"
              fontSize="32px"
              margin="1rem 0"
              multiline={1}
            >
              {track.name}
            </Heading>
          </>
        )}
        {isPlayable ? (
          <PlayButton
            size={60}
            centerSize={28}
            track={track}
            position={position}
            allTracks={allTracks}
          />
        ) : null}
        <div className="artists">
          <span>
            <ArtistList artists={track.artists} />
          </span>
        </div>
      </div>
      <style jsx>{`
        img {
          box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
          position: relative;
          z-index: 32293;
        }
        :global(.firstTrack) {
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
        .firstTrack-Container :global(h3) {
          max-width: 80%;
        }
        .firstTrack-Container :global(a) {
          color: #ffffffb3;
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

        @media (max-width: 768px) {
          .firstTrack-Container-wrapper {
            padding: 0 8px;
          }
        }
      `}</style>
    </div>
  );
}
