import useContextMenu from "hooks/useContextMenu";
import useOnScreen from "hooks/useOnScreen";
import { decode } from "html-entities";
import { useRouter } from "next/router";
import { useRef } from "react";
import { getSiteUrl } from "utils/environment";

export enum CardType {
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
  subTitle: string | JSX.Element;
  type: CardType;
}

export const CardContent: React.FC<ICardContent> = ({
  id,
  type,
  images,
  title,
  subTitle,
}) => {
  const router = useRouter();
  const handlerRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(handlerRef, "-150px");
  const { addContextMenu } = useContextMenu();

  return (
    <article>
      <div
        ref={handlerRef}
        data-testid="cardContent-button"
        aria-hidden="true"
        className="handler"
        onClick={() => {
          if (!type) return;
          router.push(`/${type}/${encodeURIComponent(id)}`);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!type) return;
            router.push(`/${type}/${encodeURIComponent(id)}`);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          const x = e.pageX;
          const y = e.pageY;
          addContextMenu({
            type: "cardContent",
            data: { id, type },
            position: { x, y },
          });
        }}
        role="button"
        tabIndex={isVisible ? 0 : -1}
      ></div>
      {images && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          loading="lazy"
          src={
            images[0]?.url ??
            (images[1]?.url || `${getSiteUrl()}/defaultSongCover.jpeg`)
          }
          alt={title}
        />
      )}
      <div>
        <strong>{title}</strong>
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
          }
        }
        @media screen and (max-width: 420px) {
          img {
            min-width: 110px;
          }
          article {
            min-width: 120px;
          }
        }
      `}</style>
    </article>
  );
};
