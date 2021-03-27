import React, { useState } from "react";

interface ModalCardTrackProps {
  track: SpotifyApi.TrackObjectFull;
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

interface AudioPlayerProps {
  audio?: string;
}
const AudioPlayer: React.FC<AudioPlayerProps> = ({ audio }) => {
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio autoPlay loop>
      <source src={audio}></source>
      Your browser isn&apos;t invited for super fun audio time.
    </audio>
  );
};

const ModalCardTrack: React.FC<ModalCardTrackProps> = ({ track }) => {
  const [isMouseEnter, setIsMouseEnter] = useState<boolean>();
  return (
    <article
      onMouseEnter={() => setIsMouseEnter(true)}
      onFocus={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
      onBlur={() => setIsMouseEnter(false)}
    >
      {track.preview_url && isMouseEnter ? (
        <AudioPlayer audio={track.preview_url} />
      ) : null}
      <a
        href={track.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
      >
        {track.album.images ? (
          <img
            src={track.album.images[2]?.url ?? track.album.images[1]?.url}
            alt=""
          />
        ) : null}
        <section>
          <strong>{`${track.name}`}</strong>
          <div>
            {track.explicit && <ExplicitSign />}
            <p>{track.artists[0].name}</p>
          </div>
        </section>
      </a>
      <style jsx>{`
        div {
          display: flex;
          align-items: center;
        }
        p {
          margin: 0;
          font-weight: 400;
        }
        strong {
          font-weight: bold;
        }
        a {
          width: 610px;
          height: 65px;
          background-color: ${track.preview_url ? "#151414" : "#202020"};
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
