import { Pause, Play, Playing } from "components/icons";
import useSpotify from "hooks/useSpotify";
import { play } from "lib/spotify";
import { useState } from "react";
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
  const { deviceId, currrentlyPlaying, player, isPlaying, setIsPlaying } =
    useSpotify();
  const [mouseEnter, setMouseEnter] = useState(false);

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
    <article
      onDoubleClick={playCurrentTrack}
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
      onMouseLeave={() => setMouseEnter(false)}
    >
      {/* {track.audio && isMouseEnter ? <AudioPlayer audio={track.audio} /> : null} */}
      {/* <a href={track.href} target="_blank" rel="noopener noreferrer"> */}
      <button
        onClick={() => {
          if (isPlaying) {
            player?.pause();
            setIsPlaying(false);
          } else {
            playCurrentTrack();
          }
        }}
      >
        {mouseEnter && isTheSameAsCurrentlyPlaying && isPlaying ? (
          <Pause fill="#fff" />
        ) : isTheSameAsCurrentlyPlaying && isPlaying ? (
          <Playing />
        ) : mouseEnter ? (
          <Play fill="#fff" />
        ) : (
          <span>{`${track.position + 1}`}</span>
        )}
      </button>
      {track.images ? (
        <img
          loading="lazy"
          src={track.images[2]?.url ?? track.images[1]?.url}
          alt=""
          width="48"
          height="48"
        />
      ) : null}
      <section>
        <p className="trackName">{`${track.name}`}</p>
        <div>
          {track.explicit && <ExplicitSign />}
          <p className="trackArtists">{track.artists}</p>
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
          margin: 0 15px 0 15px;
        }
        p.trackName {
          color: ${isTheSameAsCurrentlyPlaying ? "#1db954" : "#fff"};
          margin: 0;
          padding: 0;
        }
        p.trackArtists,
        span {
          margin: 0;
          font-family: "Lato", "sans-serif";
          font-weight: 400;
          color: #b3b3b3;
          font-size: 14px;
        }
        strong {
          font-weight: bold;
        }
        article {
          width: 100%;
          height: 65px;
          background-color: ${isTheSameAsCurrentlyPlaying
            ? "#202020"
            : "transparent"};
          margin: 0;
          padding: 0;
          display: flex;
          border-radius: 2px;
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
          margin-right: 23px;
        }
      `}</style>
    </article>
  );
};

export default ModalCardTrack;
