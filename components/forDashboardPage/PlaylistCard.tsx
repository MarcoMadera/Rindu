import { CardContent } from "./CardContentProps";
import Link from "next/link";
import useNearScreen from "hooks/useNearScreen";
import { MutableRefObject, useEffect, useRef } from "react";
import { getPlaylistsRequest } from "lib/requests";
import { PlaylistItem, PlaylistItems } from "types/spotify";

interface PlaylistCardProps {
  images?: SpotifyApi.ImageObject[];
  name: string;
  description: string | null;
  playlistId: string;
  offSet: number;
  owner: PlaylistItem["owner"];
  addItemsToPlaylists: (items: PlaylistItems, position: number) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  images,
  name,
  description,
  playlistId,
  offSet,
  addItemsToPlaylists,
  owner,
}) => {
  const cardRef = useRef<HTMLAnchorElement>();
  const shouldObserve = offSet % 50 === 0 && offSet !== 0;
  const { isNearScreen } = useNearScreen({
    distance: "200px",
    externalRef: cardRef,
    observe: shouldObserve,
  });

  useEffect(() => {
    if (shouldObserve && isNearScreen) {
      getPlaylistsRequest(offSet, 50)
        .then((res) => res.json())
        .then((playlists) => {
          addItemsToPlaylists(playlists.items, offSet);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNearScreen, offSet]);

  return (
    <Link href={`/playlist/${encodeURIComponent(playlistId)}`}>
      <a ref={cardRef as MutableRefObject<HTMLAnchorElement>}>
        <CardContent
          images={images}
          name={name}
          description={description}
          owner={owner}
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

export default PlaylistCard;
