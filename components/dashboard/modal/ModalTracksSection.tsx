import useSpotify from "../../../hooks/useSpotify";
import ModalCardTrack from "./ModalCardTrack";

interface ModalTracksSectionProps {
  duplicatesSongs: number[];
}

const ModalTracksSection: React.FC<ModalTracksSectionProps> = ({
  duplicatesSongs,
}) => {
  const { allTracks } = useSpotify();
  return (
    <div>
      {allTracks?.length > 0
        ? allTracks
            .filter((track) =>
              duplicatesSongs.some((dupPos) => track.position === dupPos)
            )
            .map((track) => {
              if (track.corruptedTrack) {
                return (
                  <p key={track.position}>{`${
                    track.position + 1
                  } canción corrupta`}</p>
                );
              }
              return <ModalCardTrack key={track.id} track={track} />;
            })
        : null}
      <style jsx>{`
        div {
          max-height: calc(100vh - 265px);
          overflow-y: auto;
        }
        div::-webkit-scrollbar {
          height: 8px;
          width: 8px;
          overflow: visible;
        }
        div::-webkit-scrollbar-thumb {
          background: #181818;
          border-radius: 30px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default ModalTracksSection;
