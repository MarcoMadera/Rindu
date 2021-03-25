import { CardContent } from "./CardContentProps";
import Link from "next/link";

interface PlaylistCardProps {
  images?: SpotifyApi.ImageObject[];
  name: string;
  description: string | null;
  playlistId: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  images,
  name,
  description,
  playlistId,
}) => {
  return (
    <Link href={`/playlist/${encodeURIComponent(playlistId)}`}>
      <a>
        <CardContent images={images} name={name} description={description} />
        <style jsx>{`
          a {
            color: inherit;
            cursor: pointer;
            border: none;
            background: unset;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default PlaylistCard;
