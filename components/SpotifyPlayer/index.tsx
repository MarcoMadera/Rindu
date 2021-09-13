/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextTrack, Pause, Play, PreviousTrack } from "components/icons";
import useSpotify from "hooks/useSpotify";
import useSpotifyPlayer from "hooks/useSpotifyPlayer";
import Script from "next/script";
import { ReactElement, useEffect, useState } from "react";

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

function ProgressBar(): ReactElement {
  const { currentlyPlayingDuration, currentlyPlayingPosition, isPlaying } =
    useSpotify();
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const durationInSeconds = currentlyPlayingDuration
    ? currentlyPlayingDuration / 1000
    : 0;

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);
    const dh = h > 0 ? `${h}:` : "";
    const dm = h > 0 && m < 10 ? `0${m}:` : `${m}:`;
    const ds = s < 10 ? `0${s}` : s;

    return `${dh}${dm}${ds}`;
  }

  useEffect(() => {
    const steps = 100 / durationInSeconds;
    if (!isPlaying) {
      return;
    }
    if (currentlyPlayingPosition) {
      setProgressSeconds(currentlyPlayingPosition / 1000);
      setProgressPercent(
        !!currentlyPlayingPosition && currentlyPlayingDuration
          ? 100 * (currentlyPlayingPosition / currentlyPlayingDuration)
          : 0
      );
    }
    const playerInterval = setInterval(() => {
      setProgressSeconds((value) => value + 1);
      setProgressPercent((value) => value + steps);
    }, 1000);
    return () => clearInterval(playerInterval);
  }, [
    currentlyPlayingPosition,
    currentlyPlayingDuration,
    durationInSeconds,
    isPlaying,
  ]);

  return (
    <div className="progressBar">
      <div className="timeTag">{formatTime(progressSeconds)}</div>
      <div className="barContainer">
        <label>
          <input
            type="range"
            min="0"
            max={durationInSeconds}
            step="5"
            aria-valuetext={`${formatTime(progressSeconds)}:${formatTime(
              durationInSeconds
            )}`}
            value={progressSeconds}
            readOnly
          />
        </label>
        <div className="transformation">
          <div className="barBackground">
            <div className="lineContainer">
              <div
                className="line"
                style={{
                  transform: `translateX(calc(-100% + ${progressPercent}%))`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="timeTag">{formatTime(durationInSeconds)}</div>
      <style jsx>{`
        .progressBar {
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          max-width: 540px;
          margin-top: 11px;
        }
        label {
          clip: rect(0 0 0 0);
          border: 0;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          width: 1px;
        }
        .timeTag {
          min-width: 40px;
          text-align: center;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
        }
        .barContainer {
          height: 12px;
          position: relative;
          width: 100%;
        }
        .transformation {
          height: 100%;
          overflow: hidden;
          touch-action: none;
          width: 100%;
        }
        .barBackground {
          border-radius: 2px;
          height: 4px;
          width: 100%;
          display: flex;
          background-color: #535353;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .lineContainer {
          overflow: hidden;
          border-radius: 2px;
          height: 4px;
          width: 100%;
        }
        .line {
          background-color: #b3b3b3;
          border-radius: 2px;
          height: 4px;
          width: 100%;
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
    <footer>
      <div className="container">
        <Script src="https://sdk.scdn.co/spotify-player.js"></Script>
        <section>
          {currrentlyPlaying && (
            <NavbarLeft currrentlyPlaying={currrentlyPlaying} />
          )}
        </section>
        <section>
          <div className="player">
            <button
              onClick={() => {
                player.current?.previousTrack();
              }}
              className="playerButton"
            >
              <PreviousTrack fill="#b3b3b3" />
            </button>
            <button
              className="toggle"
              onClick={() => player.current?.togglePlay()}
            >
              {currrentlyPlaying && isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              onClick={() => {
                player.current?.nextTrack();
              }}
              className="playerButton"
            >
              <NextTrack fill="#b3b3b3" />
            </button>
          </div>
          <ProgressBar />
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
      </div>
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
        section:nth-child(1) {
          min-width: 180px;
          width: 30%;
          display: flex;
          justify-content: flex-start;
        }
        section:nth-child(2) {
          display: flex;
          width: 100%;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        section:nth-child(2) div.player {
          display: flex;
          column-gap: 32px;
          min-width: 280px;
          justify-content: center;
          width: 40%;
        }
        section:nth-child(3) {
          display: flex;
          justify-content: flex-end;
          min-width: 180px;
          width: 30%;
        }
        div.container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: 90px;
        }
        footer {
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: #181818;
          border-top: 1px solid #282828;
        }
      `}</style>
    </footer>
  );
}
