import { ReactElement, useEffect, useState } from "react";

import { Slider } from "components";
import { useAuth, useSpotify, useToast, useTranslations } from "hooks";
import type { AudioPlayer } from "hooks/useSpotifyPlayer";
import { formatTime } from "utils";

export default function ProgressBar(): ReactElement {
  const {
    currentlyPlayingDuration,
    currentlyPlayingPosition,
    isPlaying,
    player,
    currentlyPlaying,
  } = useSpotify();
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [progressFromSpotify, setProgressFromSpotify] = useState(0);
  const [labelSeconds, setLabelSeconds] = useState(0);
  const { isPremium } = useAuth();
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const durationInSecondsPremium = currentlyPlayingDuration
    ? currentlyPlayingDuration / 1000
    : 0;
  const durationInSecondsNoPremium = currentlyPlayingDuration ?? 0;
  const durationInSeconds = isPremium
    ? durationInSecondsPremium
    : durationInSecondsNoPremium;

  useEffect(() => {
    if (!isPremium || !player) return;
    (player as Spotify.Player).getCurrentState().then((playbackState) => {
      if (playbackState) {
        setProgressFromSpotify(
          (playbackState?.position / playbackState?.duration) * 100
        );
        setProgressSeconds(playbackState?.position / 1000);
      }
    });
  }, [isPremium, player]);

  useEffect(() => {
    if (!isPremium || !player) return;
    (player as Spotify.Player)?.on("player_state_changed", (playbackState) => {
      setProgressFromSpotify(
        (playbackState?.position / playbackState?.duration) * 100
      );
      setProgressSeconds(playbackState?.position / 1000);
    });
  }, [isPremium, player]);

  useEffect(() => {
    if (!currentlyPlayingDuration || !isPremium) return;
    setProgressFromSpotify(
      ((progressSeconds * 1000) / currentlyPlayingDuration) * 100
    );
  }, [currentlyPlayingDuration, isPremium, progressSeconds]);

  useEffect(() => {
    if (
      isPremium ||
      currentlyPlayingPosition === undefined ||
      !currentlyPlayingDuration ||
      (player as AudioPlayer).sliderBusy
    )
      return;
    setProgressFromSpotify(
      (currentlyPlayingPosition / currentlyPlayingDuration) * 100
    );
    setProgressSeconds(
      currentlyPlayingPosition > currentlyPlayingDuration
        ? currentlyPlayingDuration
        : currentlyPlayingPosition
    );
  }, [currentlyPlayingDuration, currentlyPlayingPosition, isPremium, player]);

  useEffect(() => {
    setLabelSeconds(progressSeconds);
  }, [progressSeconds]);

  return (
    <div className="progressBar">
      <div className="timeTag">
        {formatTime(
          progressSeconds > durationInSeconds ? durationInSeconds : labelSeconds
        )}
      </div>
      <Slider
        title="Control the progress of the playback"
        updateProgress={progressFromSpotify}
        intervalUpdateAction={{
          steps: 100 / durationInSeconds,
          labelUpdateValue: 1,
          ms: 1000,
          shouldUpdate: isPlaying,
        }}
        onDragging={(isDragging, progressPercent) => {
          if (!isPremium && player) {
            (player as AudioPlayer).sliderBusy = isDragging;
          }
          const progressSeconds = (progressPercent * durationInSeconds) / 100;
          if (isDragging) {
            setLabelSeconds(progressSeconds);
          }
        }}
        setLabelValue={setProgressSeconds}
        valueText={`${formatTime(progressSeconds)}/${formatTime(
          durationInSeconds
        )}`}
        initialValuePercent={0}
        action={(progressPercent) => {
          if (!currentlyPlaying) {
            addToast({
              variant: "error",
              message: translations.toastMessages.nothingPlaying,
            });
            return;
          }
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
