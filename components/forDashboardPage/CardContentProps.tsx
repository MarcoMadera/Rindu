import { decode } from "html-entities";
import useAuth from "hooks/useAuth";

interface CardContentProps {
  images?: SpotifyApi.ImageObject[];
  name: string;
  description: string | null;
}
export const CardContent: React.FC<CardContentProps> = ({
  images,
  name,
  description,
}) => {
  const { user } = useAuth();
  return (
    <article>
      {images && (
        <img loading="lazy" src={images[1]?.url ?? images[0]?.url} alt={name} />
      )}
      <strong>{name}</strong>
      {<p>{decode(description) || `De ${user?.name}`}</p>}
      <style jsx>{`
        strong {
          display: block;
          margin: 3px 0;
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
          border-radius: 5px;
          padding: 12px 10px;
          background-color: #181818;
          width: 200px;
          height: 260px;
          text-align: left;
        }
        img {
          width: 180px;
          height: 180px;
        }
      `}</style>
    </article>
  );
};
