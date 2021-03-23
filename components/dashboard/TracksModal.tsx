import ReactDOM from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { trackItem } from "../../lib/types";
import useSpotify from "../../hooks/useSpotify";
import ModalContainer from "./modal/ModalContainer";

interface TracksModalProps {
  allTracks: trackItem[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedCard: {
    playlistId: string | undefined;
    snapshot_id: string | undefined;
  };
  setSelectedCard: Dispatch<
    SetStateAction<{
      playlistId: string | undefined;
      snapshot_id: string | undefined;
    }>
  >;
}

const TracksModal: React.FC<TracksModalProps> = ({
  setIsModalOpen,
  selectedCard,
}) => {
  const { allTracks } = useSpotify();
  const [targetNode, setTargetNode] = useState<Element | null>(null);
  const [duplicatesSongs, setDuplicatesSongs] = useState<number[]>([]);
  const [corruptedSongs, setCorruptedSongs] = useState<number>(0);

  useEffect(() => {
    return setTargetNode(document.querySelector("#tracksModal"));
  }, []);

  useEffect(() => {
    if (!(allTracks?.length > 0)) {
      return;
    }
    const sortedArraybyValue = allTracks.sort((a, b) => {
      if (a.corruptedTrack || b.corruptedTrack) {
        return 0;
      }
      if (a.uri && b.uri) {
        return a?.uri > b?.uri ? 1 : b?.uri > a?.uri ? -1 : 0;
      }
      return 0;
    });
    const duplicates = sortedArraybyValue
      .filter((track, i) => {
        if (track.corruptedTrack) {
          return true;
        }
        if (i === sortedArraybyValue.length - 1) {
          return false;
        }
        return track.uri === sortedArraybyValue[i + 1].uri;
      })
      .map(({ position }) => position);
    setDuplicatesSongs(duplicates);
    setCorruptedSongs(() => {
      const corrupted = allTracks.filter(
        ({ corruptedTrack }) => corruptedTrack
      );
      return corrupted.length;
    });
  }, [allTracks]);

  if (targetNode !== null) {
    return ReactDOM.createPortal(
      <section>
        <div
          className="overlay"
          role="switch"
          onKeyDown={(e) => e.key === "Escape" && setIsModalOpen(false)}
          onClick={() => setIsModalOpen(false)}
          aria-checked={true}
          tabIndex={0}
        ></div>
        <div className="container">
          <ModalContainer
            duplicatesSongs={duplicatesSongs}
            setIsModalOpen={setIsModalOpen}
            selectedCard={selectedCard}
            corruptedSongs={corruptedSongs}
          />
        </div>
        <style jsx>{`
          section {
            position: fixed;
            top: 0px;
            left: 0;
            z-index: 100;
            width: calc(100vw);
            margin: 0 auto;
            padding: 20px 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .overlay {
            position: fixed;
            z-index: -1;
            top: 0px;
            left: 0;
            width: 100vw;
            height: 100vh;
          }
          .container {
            display: block;
            width: 100%;
            max-width: 1200px;
            max-height: calc(100vh - 40px);
            height: 100%;
            padding: 24px 56px;
            background: #0a0909;
            border-radius: 30px;
          }
          :global(html) {
            overflow-y: hidden;
          }
        `}</style>
      </section>,
      targetNode
    );
  }
  return null;
};

export default TracksModal;
