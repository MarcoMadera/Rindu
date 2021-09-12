/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextTrack, Pause, Play, PreviousTrack } from "components/icons";
import useSpotify from "hooks/useSpotify";
import useSpotifyPlayer from "hooks/useSpotifyPlayer";
import Script from "next/script";
import { ReactElement, useState } from "react";

function NavbarLeft({
  currrentlyPlaying,
}: {
  currrentlyPlaying: Spotify.Track;
}): ReactElement {
  return (
    <div>
      <img src={currrentlyPlaying.album.images[1].url} alt="" />
      <section>
        <strong>{`${currrentlyPlaying.name}`}</strong>
        <p>
          {currrentlyPlaying.artists.map((_artist) => _artist.name).join(", ")}
        </p>
      </section>
      <style jsx>{`
        p {
          margin: 0;
          font-weight: 400;
        }
        div {
          width: 100%;
          height: 65px;
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
        img {
          margin: 0;
          padding: 0;
          margin-right: 23px;
        }
      `}</style>
    </div>
  );
}

export default function SpotifyPlayer(): ReactElement {
  const [volume, setVolume] = useState(1);
  const { player } = useSpotifyPlayer({ volume, name: "Rindu" });
  const { isPlaying, currrentlyPlaying } = useSpotify();

  return (
    <div>
      <Script src="https://sdk.scdn.co/spotify-player.js"></Script>
      <section>
        {currrentlyPlaying && (
          <NavbarLeft currrentlyPlaying={currrentlyPlaying} />
        )}
      </section>
      <section>
        <button
          onClick={() => {
            player.current?.previousTrack();
          }}
          className="playerButton"
        >
          <PreviousTrack fill="#b3b3b3" />
        </button>
        <button className="toggle" onClick={() => player.current?.togglePlay()}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button
          onClick={() => {
            player.current?.nextTrack();
          }}
          className="playerButton"
        >
          <NextTrack fill="#b3b3b3" />
        </button>
      </section>
      <section>
        <input
          className="volume-bar"
          onChange={(event) => {
            const volumeValue = parseInt(event.currentTarget.value) / 10;
            setVolume(volumeValue);
            player.current?.setVolume(volumeValue);
          }}
          defaultValue={10}
          type="range"
          min="0"
          max="10"
        />
      </section>
      <style jsx>{`
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          width: 32px;
          height: 32px;
          background-color: transparent;
        }
        button.toggle {
          border-radius: 50%;
          background-color: #fff;
        }
        button.playerButton:hover :global(svg path),
        button.playerButton:focus :global(svg path) {
          fill: #fff;
        }
        button.toggle:hover,
        button.toggle:focus,
        button.toggle:hover :global(svg),
        button.toggle:focus :global(svg) {
          transform: scale(1.05);
        }
        section:nth-child(2) {
          display: flex;
          column-gap: 32px;
        }
        div {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          justify-items: center;
          justify-content: space-between;
          padding: 0 50px;
          align-items: center;
          height: 90px;
          width: 100%;
          background: rgb(29, 28, 28);
        }
      `}</style>
    </div>
  );
}
