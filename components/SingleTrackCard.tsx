import useContextMenu from "hooks/useContextMenu";
import useHeader from "hooks/useHeader";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import { getMainColorFromImage } from "utils/getMainColorFromImage";
import { PlayButton } from "./forPlaylistsPage/PlayButton";

interface ISingleTrackCard {
  track: SpotifyApi.TrackObjectFull;
}

export default function SingleTrackCard({
  track,
}: ISingleTrackCard): ReactElement {
  const { setHeaderColor } = useHeader({
    showOnFixed: false,
    alwaysDisplayColor: true,
  });
  const [mainTrackColor, setMainTrackColor] = useState<string>();
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const { addContextMenu } = useContextMenu();
  const image = useRef<HTMLImageElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (image.current?.complete || imageIsLoaded) {
      setMainTrackColor(
        (prev) => getMainColorFromImage(`cover-image-${track.id}`) ?? prev
      );
    }
  }, [imageIsLoaded, track.id, router.asPath]);

  return (
    <Link href={`/track/${track.id}`}>
      <a
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
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track.album.images[0].url}
          alt={track.name}
          ref={image}
          id={`cover-image-${track.id}`}
          onLoad={() => {
            setMainTrackColor(
              (prev) => getMainColorFromImage(`cover-image-${track.id}`) ?? prev
            );
            setImageIsLoaded(true);
          }}
        />
        <div>
          <p>{track.name}</p>
          <span>
            <PlayButton isSingle track={track} centerSize={24} size={48} />
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
            a {
              display: flex;
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
              height: 80px;
              position: relative;
              transition: background-color 0.3s ease;
              text-decoration: none;
            }
            a:hover,
            a:focus {
              background-color: rgba(255, 255, 255, 0.2);
            }
            a:hover span,
            a:focus span {
              opacity: 1;
            }
            div {
              display: flex;
              color: #fff;
              flex: 1;
              justify-content: space-between;
              padding: 0 16px;
              align-items: center;
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
            }
          `}
        </style>
      </a>
    </Link>
  );
}
