import { CardContent, CardType } from "./CardContent";
import { HTMLAttributes, ReactElement } from "react";
import { PlayButton } from "components/PlayButton";
import useAuth from "hooks/useAuth";
import { ITrack } from "types/spotify";
import { useRouter } from "next/router";
import useSpotify from "hooks/useSpotify";

export interface PresentationCardProps {
  type: ITrack["type"] | CardType;
  id: string;
  images?: SpotifyApi.ImageObject[];
  title: string;
  subTitle: string | JSX.Element;
  track?: ITrack;
  isSingle?: boolean;
}

function PresentationCard({
  images,
  title,
  subTitle,
  id,
  type,
  isSingle,
  track,
  ...props
}: PresentationCardProps & HTMLAttributes<HTMLAnchorElement>): ReactElement {
  const unsupportedUris = ["genre", "user"];
  const uri = unsupportedUris.includes(type ?? "")
    ? undefined
    : `spotify:${type || "track"}:${id}`;
  const { user } = useAuth();
  const isPremium = user?.product === "premium";
  const router = useRouter();
  const isCollection = router.pathname.includes("collection");
  const { allTracks } = useSpotify();

  return (
    <div className="container">
      <CardContent
        id={id}
        type={type}
        images={images}
        title={title}
        subTitle={subTitle}
      />
      <span>
        <PlayButton
          uri={uri}
          track={track}
          isSingle={isSingle}
          centerSize={24}
          size={48}
          tabIndex={props.tabIndex}
          aria-hidden={props["aria-hidden"]}
          allTracks={allTracks}
        />
      </span>
      <style jsx>{`
        .container {
          color: inherit;
          cursor: pointer;
          border: none;
          background: unset;
          margin: 0;
          padding: 0;
          text-decoration: none;
          position: relative;
          background-color: #181818;
          transition: background-color 0.3s ease;
          border-radius: 4px;
          width: ${isCollection ? "unset" : "min-content"};
        }
        span {
          position: absolute;
          bottom: 100px;
          right: 24px;
          transition: all 0.3s ease;
          opacity: 0;
          display: ${!isPremium || !uri ? "none" : "flex"};
          z-index: 2;
        }
        .container:hover,
        .container:focus-within {
          background-color: #282828;
        }
        .container:focus-within span,
        .container:hover span {
          transform: translateY(-8px);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default PresentationCard;
