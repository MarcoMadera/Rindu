import { Dispatch, SetStateAction } from "react";
import useAuth from "../../hooks/useAuth";
import useSpotify from "../../hooks/useSpotify";
import { CardContent } from "./CardContentProps";

interface PlaylistCardProps {
  images?: SpotifyApi.ImageObject[];
  name: string;
  isPublic: boolean | null;
  tracks: number;
  description: string | null;
  snapshot_id: string;
  playlistId: string;
  setSelectedCard?: Dispatch<
    SetStateAction<{
      playlistId: string | undefined;
      snapshot_id: string | undefined;
    }>
  >;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  images,
  name,
  description,
  snapshot_id,
  playlistId,
  setSelectedCard,
  setIsModalOpen,
}) => {
  const { accessToken } = useAuth();
  const { getTracksFromPlayList } = useSpotify(accessToken);
  if (!setIsModalOpen || !setSelectedCard) {
    return (
      <CardContent images={images} name={name} description={description} />
    );
  }
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setSelectedCard({ playlistId, snapshot_id });
        getTracksFromPlayList(playlistId);
        setIsModalOpen(true);
      }}
    >
      <CardContent images={images} name={name} description={description} />
      <style jsx>{`
        button {
          color: inherit;
          cursor: pointer;
          border: none;
          background: unset;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </button>
  );
};

export default PlaylistCard;
