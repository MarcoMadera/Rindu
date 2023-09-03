import { ReactElement, useEffect, useState } from "react";

import { Slider } from "components";
import { useAuth, useSpotify, useToast, useTranslations } from "hooks";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { formatTime, ToastMessage } from "utils";

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
  const { user } = useAuth();
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const isPremium = user?.product === "premium";
  const durationInSecondsPremium = currentlyPlayingDuration
    ? currentlyPlayingDuration / 1000
    : 0;
  const durationInSecondsNoPremium = currentlyPlayingDuration ?? 0;
  const durationInSeconds = isPremium
    ? durationInSecondsPremium
    : durationInSecondsNoPremium;

  useEffect(() => {
    if (!isPremium || !player) return;
    (player as Spotify.Player)?.on("player_state_changed", (playbackState) => {
      setProgressFromSpotify(
        (playbackState?.position / playbackState?.duration) * 100
      );
      setProgressSeconds(playbackState?.position / 1000);
    });

    return () => {
      setProgressFromSpotify(0);
      setProgressSeconds(0);
    };
  }, [isPremium, player]);

  useEffect(() => {
    if (!currentlyPlayingDuration) return;
    setProgressFromSpotify(
      ((progressSeconds * 1000) / currentlyPlayingDuration) * 100
    );
  }, [currentlyPlayingDuration, progressSeconds]);

  useEffect(() => {
    if (isPremium || !currentlyPlayingPosition || !currentlyPlayingDuration)
      return;
    setProgressFromSpotify(
      ((currentlyPlayingPosition * 1000) / currentlyPlayingDuration) * 100
    );
  }, [currentlyPlayingDuration, currentlyPlayingPosition, isPremium]);

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
              message: translations[ToastMessage.NothingPlaying],
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
