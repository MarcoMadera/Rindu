import { CardContent } from "./CardContentProps";
import Link from "next/link";
import { MutableRefObject, useRef } from "react";

interface PresentationCardProps {
  type: "playlist" | "album" | "artist" | "user" | "show";
  id: string;
  images?: SpotifyApi.ImageObject[];
  title: string;
  subTitle: string;
}

const PresentationCard: React.FC<PresentationCardProps> = ({
  images,
  title,
  subTitle,
  id,
  type,
}) => {
  const cardRef = useRef<HTMLAnchorElement>();

  return (
    <Link href={`/${type}/${encodeURIComponent(id)}`}>
      <a ref={cardRef as MutableRefObject<HTMLAnchorElement>}>
        <CardContent
          type={type}
          images={images}
          title={title}
          subTitle={subTitle}
        />
        <style jsx>{`
          a {
            color: inherit;
            cursor: pointer;
            border: none;
            background: unset;
            margin: 0;
            padding: 0;
            text-decoration: none;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default PresentationCard;
