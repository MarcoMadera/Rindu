import { trackItem } from "../../../lib/types";

interface ModalCardTrackProps {
  track: trackItem;
}

const ModalCardTrack: React.FC<ModalCardTrackProps> = ({ track }) => {
  return (
    <article>
      <a href={track.href} target="_blank" rel="noopener noreferrer">
        {track.images ? (
          <img src={track.images[2]?.url ?? track.images[1]?.url} alt="" />
        ) : null}
        <div>
          <p>
            <strong>{`${track.name}`}</strong>
          </p>
          <p>{track.artists}</p>
        </div>
      </a>
      <style jsx>{`
        p {
          margin: 0;
        }
        a {
          width: 610px;
          height: 65px;
          background-color: #151414;
          border-radius: 10px;
          margin: 0;
          padding: 0;
          display: flex;
          margin-bottom: 10px;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        img {
          margin: 0;
          padding: 0;
          border-radius: 10px 0 0 10px;
          margin-right: 23px;
        }
      `}</style>
    </article>
  );
};

export default ModalCardTrack;
