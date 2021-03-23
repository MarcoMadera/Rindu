import React, { Dispatch, SetStateAction } from "react";
import useAuth from "../../../hooks/useAuth";
import useSpotify from "../../../hooks/useSpotify";
import ModalHeader from "./ModalHeader";
import ModalPlaylistInfo from "./ModalPlaylistInfo";
import ModalTracksSection from "./ModalTracksSection";

interface ModalContainerProps {
  duplicatesSongs: number[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedCard: {
    playlistId: string | undefined;
    snapshot_id: string | undefined;
  };
  corruptedSongs: number;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  duplicatesSongs,
  setIsModalOpen,
  selectedCard,
  corruptedSongs,
}) => {
  const { accessToken } = useAuth();
  const { playlists, removeTracks } = useSpotify(accessToken);
  const [card] = playlists.filter(
    (playlist) => playlist.id === selectedCard.playlistId
  );
  return (
    <>
      <ModalHeader setIsModalOpen={setIsModalOpen} />
      <section>
        <ModalPlaylistInfo
          card={card}
          corruptedSongs={corruptedSongs}
          duplicatesSongs={duplicatesSongs}
        />
        <ModalTracksSection duplicatesSongs={duplicatesSongs} />
      </section>
      <div>
        <button
          onClick={async () => {
            const snapshot = await removeTracks(
              card.id,
              duplicatesSongs,
              card.snapshot_id
            );
            if (snapshot) {
              // Remove Tracks action
              console.log(snapshot);
            }
          }}
        >
          Limpiar playlists
        </button>
      </div>
      <style jsx>{`
        section {
          display: grid;
          grid-template-columns: 200px minmax(0, 1fr);
          grid-gap: 60px;
        }
        p {
          display: block;
        }
        div {
          text-align: center;
          margin-top: 10px;
        }
        button {
          border: none;
          background-color: #d62323;
          color: inherit;
          font-weight: bold;
          font-size: 24px;
          border-radius: 10px;
          padding: 10px 20px;
          font-family: inherit;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ModalContainer;
