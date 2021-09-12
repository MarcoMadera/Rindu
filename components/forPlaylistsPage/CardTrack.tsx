import { Pause, Play } from "components/icons";
import useSpotify from "hooks/useSpotify";
import { play } from "lib/spotify";
import { normalTrackTypes } from "types/spotify";

interface ModalCardTrackProps {
  track: normalTrackTypes;
  accessToken: string | undefined;
  playlistUri: string;
}

const ExplicitSign: React.FC = () => {
  return (
    <div>
      <small>E</small>
      <style jsx>{`
        small {
          font-size: 10px;
          font-weight: bold;
          color: #463f3f;
          font-family: "Lato", sans-serif;
        }
        div {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          background-color: #d2d2d2;
          width: 17px;
          height: 17px;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

// interface AudioPlayerProps {
//   audio?: string;
// }
// const AudioPlayer: React.FC<AudioPlayerProps> = ({ audio }) => {
//   return (
//     // eslint-disable-next-line jsx-a11y/media-has-caption
//     <audio autoPlay loop>
//       <source src={audio}></source>
//       Your browser isn&apos;t invited for super fun audio time.
//     </audio>
//   );
// };

const ModalCardTrack: React.FC<ModalCardTrackProps> = ({
  accessToken,
  track,
  playlistUri,
}) => {
  const { deviceId, currrentlyPlaying } = useSpotify();

  async function playCurrentTrack() {
    if (accessToken && track.uri && deviceId) {
      const res = await play(accessToken, deviceId, {
        context_uri: playlistUri,
        offset: track.position,
      });
      return res;
    }
  }

  const currrentlyPlayingArtist = currrentlyPlaying?.artists
    .map(({ name }) => name)
    .join(", ");

  const isTheSameAsCurrentlyPlaying =
    currrentlyPlaying?.name === track.name &&
    currrentlyPlayingArtist === track.artists;

  return (
    <article onDoubleClick={playCurrentTrack}>
      {/* {track.audio && isMouseEnter ? <AudioPlayer audio={track.audio} /> : null} */}
      {/* <a href={track.href} target="_blank" rel="noopener noreferrer"> */}
      <button onClick={playCurrentTrack}>
        {isTheSameAsCurrentlyPlaying ? (
          <Pause fill="#fff" />
        ) : (
          <Play fill="#fff" />
        )}
      </button>
      {track.images ? (
        <img src={track.images[2]?.url ?? track.images[1]?.url} alt="" />
      ) : null}
      <section>
        <strong>{`${track.name}`}</strong>
        <div>
          {track.explicit && <ExplicitSign />}
          <p>{track.artists}</p>
        </div>
      </section>
      {/* </a> */}
      <style jsx>{`
        div {
          display: flex;
          align-items: center;
        }
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          border: none;
          width: 32px;
          height: 32px;
        }
        p {
          margin: 0;
          font-weight: 400;
        }
        strong {
          font-weight: bold;
        }
        article {
          width: 100%;
          height: 65px;
          background-color: ${isTheSameAsCurrentlyPlaying
            ? "#202020"
            : "#151414"};
          border-radius: 10px;
          margin: 0;
          padding: 0;
          display: flex;
          margin-bottom: 10px;
          align-items: center;
          text-decoration: none;
          color: inherit;
          cursor: default;
          user-select: none;
        }
        article:hover,
        article:focus {
          background-color: #202020;
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
