import { NextTrack, Pause, Play, PreviousTrack } from "components/icons";
import { Volume } from "components/icons/Volume";
import Slider from "components/Slider";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import useSpotifyPlayer, { AudioPlayer } from "hooks/useSpotifyPlayer";
import Script from "next/script";
import { ReactElement, useEffect, useState } from "react";
import { formatTime } from "utils/formatTime";
import Link from "next/link";
import { normalTrackTypes } from "types/spotify";

function NavbarLeft({
  currrentlyPlaying,
}: {
  currrentlyPlaying: normalTrackTypes;
}): ReactElement {
  return (
    <div>
      <img
        src={
          currrentlyPlaying.album.images[2]?.url ??
          currrentlyPlaying.album.images[1]?.url
        }
        alt={currrentlyPlaying.album.name}
        width={64}
        height={64}
      />
      <section>
        <p className="trackName">{currrentlyPlaying.name}</p>
        <span className="trackArtists">
          {currrentlyPlaying.artists?.map((artist) => {
            return (
              <Link key={artist.id} href={`/artist/${artist.id}`}>
                <a>{artist.name}</a>
              </Link>
            );
          })}
        </span>
      </section>
      <style jsx>{`
        p.trackName {
          color: #fff;
          margin: 0;
          padding: 0;
        }
        span.trackArtists {
          font-size: 14px;
        }
        a {
          text-decoration: none;
          margin-right: 5px;
          color: inherit;
        }
        a:hover {
          color: #fff;
          text-decoration: underline;
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
  const {
    currentlyPlayingDuration,
    currentlyPlayingPosition,
    isPlaying,
    player,
  } = useSpotify();
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [progressFromSpotify, setProgressFromSpotify] = useState(0);
  const { user } = useAuth();
  const isPremium = user?.product === "premium";
  const durationInSeconds = currentlyPlayingDuration
    ? isPremium
      ? currentlyPlayingDuration / 1000
      : currentlyPlayingDuration
    : 0;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    if (currentlyPlayingPosition) {
      setProgressFromSpotify(
        !!currentlyPlayingPosition && currentlyPlayingDuration
          ? 100 * (currentlyPlayingPosition / currentlyPlayingDuration)
          : 0
      );
      setProgressSeconds(
        isPremium ? currentlyPlayingPosition / 1000 : currentlyPlayingPosition
      );
    }
  }, [
    currentlyPlayingPosition,
    currentlyPlayingDuration,
    isPlaying,
    isPremium,
  ]);

  return (
    <div className="progressBar">
      <div className="timeTag">
        {formatTime(
          progressSeconds > durationInSeconds
            ? durationInSeconds
            : progressSeconds
        )}
      </div>
      <Slider
        updateProgress={progressFromSpotify}
        intervalUpdateAction={{
          steps: 100 / durationInSeconds,
          labelUpdateValue: 1,
          ms: 1000,
          shouldUpdate: isPlaying,
        }}
        onDragging={(isDragging) => {
          if (!isPremium && player) {
            (player as AudioPlayer).sliderBusy = isDragging;
          }
        }}
        setLabelValue={setProgressSeconds}
        onProgressChange={(currentPositionPercent) => {
          setProgressSeconds(
            (currentPositionPercent * (currentlyPlayingDuration ?? 0)) /
              100 /
              (isPremium ? 1000 : 1)
          );
        }}
        valueText={`${formatTime(progressSeconds)}:${formatTime(
          durationInSeconds
        )}`}
        initialValuePercent={0}
        value={progressSeconds}
        maxValue={durationInSeconds}
        action={(progressPercent) => {
          player?.seek(
            (progressPercent * (currentlyPlayingDuration ?? 0)) / 100
          );
        }}
      />
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
        .timeTag {
          min-width: 40px;
          text-align: center;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default function SpotifyPlayer(): ReactElement {
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);
  useSpotifyPlayer({ volume, name: "Rindu" });
  const { player } = useSpotify();
  const { isPlaying, currrentlyPlaying } = useSpotify();
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const { user } = useAuth();
  const isPremium = user?.product === "premium";

  return (
    <footer>
      <div className="container">
        {isPremium ? (
          <Script src="https://sdk.scdn.co/spotify-player.js"></Script>
        ) : null}
        <section>
          {currrentlyPlaying && (
            <NavbarLeft currrentlyPlaying={currrentlyPlaying} />
          )}
        </section>
        <section>
          <div className="player">
            <button
              onClick={() => {
                player?.previousTrack();
              }}
              className="playerButton"
            >
              <PreviousTrack fill="#b3b3b3" />
            </button>
            <button className="toggle" onClick={() => player?.togglePlay()}>
              {currrentlyPlaying && isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              onClick={() => {
                player?.nextTrack();
              }}
              className="playerButton"
            >
              <NextTrack fill="#b3b3b3" />
            </button>
          </div>
          <ProgressBar />
        </section>
        <section>
          <div className="extras">
            <button
              className="volume"
              onMouseEnter={() => {
                setIsHoveringVolume(true);
              }}
              onMouseLeave={() => {
                setIsHoveringVolume(false);
              }}
              aria-label={`${volume > 0 ? "Mute" : "Unmute"}`}
              onClick={() => {
                setLastVolume(volume);
                setVolume(volume > 0 ? 0 : lastVolume === 0 ? 1 : lastVolume);
                player?.setVolume(
                  volume > 0 ? 0 : volume === 0 ? 1 : lastVolume
                );
              }}
            >
              <Volume volume={volume} />
            </button>
            <Slider
              value={100}
              updateProgress={volume * 100}
              onProgressChange={(currentPositionPercent) => {
                setVolume(currentPositionPercent / 100);
              }}
              action={() => {
                player?.setVolume(volume);
              }}
              valueText={`${volume}`}
              initialValuePercent={100}
              maxValue={1}
              showDot={isHoveringVolume}
            />
          </div>
        </section>
      </div>
      <style jsx>{`
        .extras {
          display: flex;
          width: 100%;
          column-gap: 5px;
          align-items: center;
        }
        .volume:hover :global(svg path) {
          fill: #fff;
        }
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
        button.playerButton:active :global(svg path) {
          fill: #b3b3b3;
        }
        button.toggle:hover,
        button.toggle:focus,
        button.toggle:hover :global(svg),
        button.toggle:focus :global(svg) {
          transform: scale(1.05);
        }
        button.toggle:active {
          transform: scale(1);
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
