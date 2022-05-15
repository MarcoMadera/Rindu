import { CardContent } from "./CardContentProps";
import Link from "next/link";
import { HTMLAttributes, MutableRefObject, useRef } from "react";
import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import useAuth from "hooks/useAuth";

interface PresentationCardProps {
  type:
    | "playlist"
    | "album"
    | "artist"
    | "user"
    | "show"
    | "genre"
    | "track"
    | "episode";
  id: string;
  images?: SpotifyApi.ImageObject[];
  title: string;
  subTitle: string | JSX.Element;
  track?: SpotifyApi.TrackObjectFull;
  isSingle?: boolean;
}

const PresentationCard: React.FC<
  PresentationCardProps & HTMLAttributes<HTMLAnchorElement>
> = ({ images, title, subTitle, id, type, isSingle, track, ...props }) => {
  const cardRef = useRef<HTMLAnchorElement>();
  const unsupportedUris = ["genre", "user"];
  const uri = unsupportedUris.includes(type)
    ? undefined
    : `spotify:${type}:${id}`;
  const { user } = useAuth();
  const isPremium = user?.product === "premium";
  return (
    <div>
      <Link href={`/${type}/${encodeURIComponent(id)}`}>
        <a ref={cardRef as MutableRefObject<HTMLAnchorElement>} {...props}>
          <CardContent
            type={type}
            images={images}
            title={title}
            subTitle={subTitle}
          />
        </a>
      </Link>
      <span>
        <PlayButton
          uri={uri}
          track={track}
          isSingle={isSingle}
          centerSize={24}
          size={48}
          tabIndex={props.tabIndex}
          aria-hidden={props["aria-hidden"]}
        />
      </span>
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
        div {
          position: relative;
        }
        span {
          position: absolute;
          bottom: 100px;
          right: 24px;
          transition: all 0.3s ease;
          opacity: 0;
          display: ${!isPremium || !uri ? "none" : "flex"};
        }
        div:focus-within span,
        div:hover span {
          transform: translateY(-8px);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default PresentationCard;
