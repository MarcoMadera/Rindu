import { ReactElement, useEffect, useState } from "react";

import css from "styled-jsx/css";

import { Slider } from "components";
import {
  useAuth,
  useLyricsContext,
  useSpotify,
  useToast,
  useTranslations,
} from "hooks";
import type { AudioPlayer } from "hooks/useSpotifyPlayer";
import { formatTime, isServer } from "utils";

export const styles = css.global`
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

  @media (display-mode: picture-in-picture) {
    .progressBar {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto auto;
      width: 100%;
      gap: 4px 0;
      margin-top: 0;
    }
    .timeTag {
      min-width: 40px;
      font-size: 11px;
      font-weight: 400;
      letter-spacing: normal;
      line-height: 16px;
      user-select: none;
      color: #aaa;
    }
    .timeTag:first-of-type {
      grid-column: 1;
      grid-row: 1;
      text-align: left;
    }

    .timeTag:last-of-type {
      grid-column: 3;
      grid-row: 1;
      text-align: right;
    }

    .barContainer {
      grid-column: 1 / span 3;
      grid-row: 2;
      height: 4px;
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }
  }
`;

export default function ProgressBar({
  document = isServer() ? undefined : window.document,
}: {
  document?: Document;
}): ReactElement {
  const {
    currentlyPlayingDuration,
    currentlyPlayingPosition,
    isPlaying,
    player,
    currentlyPlaying,
  } = useSpotify();
  const { syncLyricsLine } = useLyricsContext();
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [progressFromSpotify, setProgressFromSpotify] = useState<number>();
  const [labelSeconds, setLabelSeconds] = useState(0);
  const { isPremium } = useAuth();
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const durationInSecondsPremium = currentlyPlayingDuration
    ? currentlyPlayingDuration / 1000
    : 0;
  const durationInSeconds = durationInSecondsPremium;

  useEffect(() => {
    if (!isPremium || !player) return;
    (player as Spotify.Player).getCurrentState().then((playbackState) => {
      if (playbackState) {
        setProgressFromSpotify(
          (playbackState?.position / playbackState?.duration) * 100
        );
        const progressSeconds = playbackState?.position / 1000;

        setProgressSeconds(progressSeconds);
        setLabelSeconds(progressSeconds);
      }
    });
  }, [isPremium, player]);

  useEffect(() => {
    if (!isPremium || !player) return;
    (player as Spotify.Player)?.on("player_state_changed", (playbackState) => {
      setProgressFromSpotify(
        (playbackState?.position / playbackState?.duration) * 100
      );
      const progressSeconds = playbackState?.position / 1000;
      setProgressSeconds(progressSeconds);
      setLabelSeconds(progressSeconds);
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
    const progressSeconds =
      currentlyPlayingPosition > currentlyPlayingDuration
        ? currentlyPlayingDuration
        : currentlyPlayingPosition / 1000;

    setProgressSeconds(progressSeconds);
    setLabelSeconds(progressSeconds);
  }, [currentlyPlayingDuration, currentlyPlayingPosition, isPremium, player]);

  useEffect(() => {
    if (!currentlyPlayingPosition || !currentlyPlayingDuration) return;

    if (
      currentlyPlayingPosition >= currentlyPlayingDuration ||
      currentlyPlayingPosition === 0
    ) {
      setProgressFromSpotify(0);
    }
  }, [currentlyPlayingDuration, currentlyPlayingPosition, currentlyPlaying]);

  return (
    <div className="progressBar">
      <div className="timeTag">
        {formatTime(
          progressSeconds > durationInSeconds ? durationInSeconds : labelSeconds
        )}
      </div>
      <Slider
        key={currentlyPlaying?.uri}
        document={document}
        title="Control the progress of the playback"
        updateProgress={progressFromSpotify}
        intervalUpdateAction={{
          steps: 100 / durationInSeconds,
          labelUpdateValue: 1,
          ms: 1000,
          shouldUpdate: isPlaying,
          maxLabelValue: durationInSeconds,
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
        setLabelValue={setLabelSeconds}
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
          const position_ms =
            (progressPercent * (currentlyPlayingDuration ?? 0)) / 100;

          setLabelSeconds(position_ms / 1000);
          player?.seek(position_ms);
          syncLyricsLine();
        }}
      />
      <div className="timeTag">{formatTime(durationInSeconds)}</div>
      <style jsx>{styles}</style>
    </div>
  );
}
