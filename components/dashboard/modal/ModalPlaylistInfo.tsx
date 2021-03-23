import { PlaylistItem } from "../../../lib/types";
import PlaylistCard from "../PlaylistCard";

interface ModalPlaylistInfoProps {
  corruptedSongs: number;
  duplicatesSongs: number[];
  card: PlaylistItem;
}

const ModalPlaylistInfo: React.FC<ModalPlaylistInfoProps> = ({
  corruptedSongs,
  duplicatesSongs,
  card,
}) => {
  return (
    <div>
      <PlaylistCard
        images={card.images}
        name={card.name}
        isPublic={card.isPublic}
        tracks={card.tracks}
        description={card.description}
        snapshot_id={card.snapshot_id}
        playlistId={card.id}
      />
      <p>Tracks:</p>
      <span>{card.tracks}</span>
      <p>Tracks duplicados:</p>
      <span>{duplicatesSongs?.length}</span>
      <p>Tracks invisibles:</p>
      <span>{corruptedSongs}</span>
      <style jsx>{`
        p {
          margin: 10px 0 0 0;
        }
      `}</style>
    </div>
  );
};

export default ModalPlaylistInfo;
