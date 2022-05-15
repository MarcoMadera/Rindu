import { decode } from "html-entities";
import { SITE_URL } from "utils/constants";

interface CardContentProps {
  images?: SpotifyApi.ImageObject[];
  title: string;
  subTitle: string | JSX.Element;
  type:
    | "playlist"
    | "album"
    | "artist"
    | "user"
    | "show"
    | "genre"
    | "track"
    | "episode";
}
export const CardContent: React.FC<CardContentProps> = ({
  type,
  images,
  title,
  subTitle,
}) => {
  return (
    <article>
      {images && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          loading="lazy"
          src={
            images[0]?.url ??
            (images[1]?.url || `${SITE_URL}/defaultSongCover.jpeg`)
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
        strong {
          display: block;
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
          color: #b3b3b3;
        }
        article {
          width: 100%;
          min-width: 100%;
          height: 100%;
          text-align: left;
          border-radius: 4px;
          flex: 1;
          isolation: isolate;
          padding: 16px;
          position: relative;
          max-width: min-content;
        }
        img {
          width: 100%;
          min-width: 160px;
          margin-bottom: 16px;
          border-radius: ${type === "artist" || type === "user"
            ? "50%"
            : "2px"};
          box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
          object-fit: cover;
          object-position: center center;
          aspect-ratio: 1;
        }
      `}</style>
    </article>
  );
};
