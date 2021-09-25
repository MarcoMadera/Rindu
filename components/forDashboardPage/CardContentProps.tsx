import { decode } from "html-entities";
import { SITE_URL } from "utils/constants";
import { PlaylistItem } from "types/spotify";

interface CardContentProps {
  images?: SpotifyApi.ImageObject[];
  name: string;
  description: string | null;
  owner: PlaylistItem["owner"];
}
export const CardContent: React.FC<CardContentProps> = ({
  images,
  name,
  description,
  owner,
}) => {
  return (
    <article>
      {images && (
        <img
          loading="lazy"
          src={
            images[1]?.url ??
            (images[0]?.url || `${SITE_URL}/defaultSongCover.jpeg`)
          }
          alt={name}
        />
      )}
      <div>
        <strong>{name}</strong>
        <p>
          {decode(description) || owner?.display_name
            ? `De ${owner?.display_name}`
            : ""}
        </p>
      </div>
      <style jsx>{`
        div {
          min-height: 62px;
        }
        strong {
          display: block;
          margin-top: 4px;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
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
        }
        article {
          background-color: #181818;
          width: 100%;
          height: 100%;
          text-align: left;
          border-radius: 4px;
          flex: 1;
          isolation: isolate;
          padding: 16px;
          position: relative;
          transition: background-color 0.3s ease;
        }
        article:hover {
          background-color: #282828;
        }
        img {
          width: 160px;
          height: 160px;
          margin-bottom: 16px;
          border-radius: 2px;
          box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
        }
      `}</style>
    </article>
  );
};
