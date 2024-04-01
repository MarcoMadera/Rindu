import { ReactElement, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { PlayButton } from "components";
import { useContextMenu, useHeader, useSpotify } from "hooks";
import { ITrack } from "types/spotify";
import { chooseImage, getMainColorFromImage } from "utils";

interface ISingleTrackCard {
  track: ITrack;
}

export default function SingleTrackCard({
  track,
}: Readonly<ISingleTrackCard>): ReactElement {
  const { setHeaderColor } = useHeader();
  const [mainTrackColor, setMainTrackColor] = useState<string>("");
  const { addContextMenu } = useContextMenu();
  const router = useRouter();
  const { allTracks } = useSpotify();

  useEffect(() => {
    getMainColorFromImage(`cover-image-${track.id ?? ""}`, setMainTrackColor);
  }, [track.id, router.asPath]);

  return (
    <Link
      href={`/track/${track.id ?? ""}`}
      onMouseEnter={() => {
        setHeaderColor((prev) => {
          return mainTrackColor ?? prev;
        });
      }}
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
      className="SingleTrackCard"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={chooseImage(track.album?.images, 80).url}
        alt={track.name}
        id={`cover-image-${track.id ?? ""}`}
      />
      <div>
        <p>{track.name}</p>
        <span>
          <PlayButton
            isSingle
            track={track}
            centerSize={24}
            size={48}
            allTracks={allTracks}
          />
        </span>
      </div>
      <style jsx>
        {`
          img {
            width: 80px;
            height: 80px;
            border-radius: 4px 0 0 4px;
            box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
            background-color: rgba(255, 255, 255, 0.2);
          }
          span {
            border-radius: 500px;
            box-shadow: 0 8px 8px rgb(0 0 0 / 30%);
            display: flex;
            opacity: 0;
            position: relative;
            transition: all 0.3s ease;
            margin-left: 8px;
            flex-shrink: 0;
          }
          :global(.SingleTrackCard) {
            display: flex;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            height: 80px;
            position: relative;
            transition: background-color 1s ease;
            text-decoration: none;
          }
          :global(.SingleTrackCard:hover),
          :global(.SingleTrackCard:focus) {
            background-color: rgba(255, 255, 255, 0.2);
          }
          :global(.SingleTrackCard:hover) span,
          :global(.SingleTrackCard:focus-within) span {
            opacity: 1;
          }
          div {
            display: flex;
            color: #fff;
            flex: 1;
            justify-content: space-between;
            padding: 0 16px;
            align-items: center;
            position: relative;
          }
          p {
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            white-space: normal;
            word-break: break-word;
            font-size: 1rem;
            line-height: 1.5rem;
            text-transform: none;
            letter-spacing: normal;
            margin: 0;
            width: calc(100% - 16px);
          }
          @media screen and (max-width: 768px) {
            img {
              width: 60px;
              height: 60px;
            }
            :global(.SingleTrackCard) {
              height: 60px;
            }
            span {
              margin-left: 4px;
              transform: scale(0.8);
              position: absolute;
              right: 0;
            }
            div {
              padding: 0 4px;
            }
            p {
              width: 100%;
            }
          }
        `}
      </style>
    </Link>
  );
}
