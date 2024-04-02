import { ReactElement, useCallback, useId, useRef } from "react";

import { decode } from "html-entities";
import { useRouter } from "next/router";

import { useContextMenu } from "hooks";
import { Booleanish } from "types/customTypes";
import { chooseImage, handleAsyncError } from "utils";

export enum CardType {
  SIMPLE = "simple",
  PLAYLIST = "playlist",
  ALBUM = "album",
  ARTIST = "artist",
  USER = "user",
  SHOW = "show",
  GENRE = "genre",
  TRACK = "track",
  EPISODE = "episode",
  AD = "ad",
}

export interface ICardContent {
  id: string;
  images?: SpotifyApi.ImageObject[];
  title: string;
  subTitle: string | ReactElement;
  type: CardType;
  url?: string;
  tabIndex?: number;
  "aria-hidden"?: Booleanish;
}

export default function CardContent({
  id,
  type,
  images,
  title,
  subTitle,
  url,
  tabIndex,
  "aria-hidden": ariaHidden,
}: Readonly<ICardContent>): ReactElement {
  const router = useRouter();
  const handlerRef = useRef<HTMLButtonElement>(null);
  const { addContextMenu } = useContextMenu();
  const cardContentId = useId();
  const uri = `spotify:${type}:${id}`;

  const handleClick = useCallback(async () => {
    if (!type) return;
    if (type === CardType.SIMPLE && url) {
      await router.push(url);
      return;
    }
    await router.push(`/${type}/${encodeURIComponent(id)}`);
  }, [id, router, type, url]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (type === CardType.SIMPLE && url) return;
      e.preventDefault();
      const x = e.pageX;
      const y = e.pageY;
      addContextMenu({
        type: type === CardType.TRACK ? "cardTrack" : "cardContent",
        data: {
          id,
          type,
          uri,
        },
        position: { x, y },
      });
    },
    [addContextMenu, id, type, uri, url]
  );

  return (
    <article>
      <button
        ref={handlerRef}
        data-testid="cardContent-button"
        className="handler"
        onClick={handleAsyncError(handleClick)}
        onContextMenu={handleContextMenu}
        aria-labelledby={cardContentId}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden}
      ></button>
      {images && (
        // eslint-disable-next-line @next/next/no-img-element
        <img loading="lazy" src={chooseImage(images, 300).url} alt={title} />
      )}
      <div>
        <strong id={cardContentId}>{title}</strong>
        <p>
          {typeof subTitle === "string"
            ? decode(subTitle).slice(0, 200)
            : subTitle}
        </p>
      </div>
      <style jsx>{`
        div {
          min-height: 62px;
        }
        .handler {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          z-index: 1;
          background-color: transparent;
          top: 0;
          left: 0;
          border: none;
          cursor: pointer;
        }
        strong {
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
          word-break: break-all;
          margin: 4px 0;
        }
        p {
          font-weight: 300;
          margin: 0em 0;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
          word-break: break-all;
          font-size: 15px;
          color: #ffffffb3;
        }
        article {
          width: 100%;
          min-width: 190px;
          height: 100%;
          text-align: left;
          border-radius: 4px;
          flex: 1;
          isolation: isolate;
          padding: 16px;
          position: relative;
        }
        img {
          width: 100%;
          min-width: 160px;
          margin-bottom: 16px;
          --card-image-border-radius: clamp(
            4px,
            (var(--left-panel-width, 0px) - 32px) * 0.025,
            8px
          );
          border-radius: ${type === CardType.ARTIST || type === CardType.USER
            ? "50%"
            : "var(--card-image-border-radius)"};
          box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
          object-fit: cover;
          object-position: center center;
          aspect-ratio: 1;
        }
        @media screen and (max-width: 768px) {
          img {
            min-width: 140px;
          }
          article {
            min-width: 160px;
            padding: 0 8px;
          }
        }
      `}</style>
    </article>
  );
}
