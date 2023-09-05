import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { useAuth, useSpotify } from "hooks";
import { DisplayInFullScreen } from "types/spotify";
import {
  colorCodedToHex,
  colorCodedToRGB,
  getAllLinesFittingWidth,
  getRandomColor,
  hexToHsl,
  IFormatLyricsResponse,
  LYRICS_PADDING_LEFT,
  LYRICS_PIP_HEADER_HEIGH,
  rgbToHex,
} from "utils";
import { applyLyricLinePositionAndColor } from "utils/applyLyricLinePositionAndColor";

interface IUseLyricsInPictureInPicture {
  setLyricsProgressMs: Dispatch<SetStateAction<number>>;
  setLyricLineColor: Dispatch<SetStateAction<string>>;
  setLyricTextColor: Dispatch<SetStateAction<string>>;
  lyrics: IFormatLyricsResponse | null;
  lyricsBackgroundColor?: string;
  lyricTextColor: string;
  lyricLineColor: string;
  lyricsProgressMs: number;
  setLyricsBackgroundColor: Dispatch<SetStateAction<string | undefined>>;
  lyricsError: string | null;
  requestLyrics: boolean;
}

export function useLyricsInPictureInPicture({
  setLyricsProgressMs,
  setLyricLineColor,
  setLyricTextColor,
  setLyricsBackgroundColor,
  lyrics,
  lyricsBackgroundColor,
  lyricTextColor,
  lyricLineColor,
  lyricsProgressMs,
  lyricsError,
  requestLyrics,
}: IUseLyricsInPictureInPicture): void {
  const {
    isPictureInPictureLyircsCanvas,
    currentlyPlaying,
    setDisplayInFullScreen,
    currentlyPlayingDuration,
    isPlaying,
    player,
    pictureInPictureCanvas,
  } = useSpotify();
  const [spinnerFrame, setSpinnerFrame] = useState<number | null>(null);
  const { user } = useAuth();
  const isPremium = user?.product === "premium";
  const title = currentlyPlaying?.name ?? "";
  const artist = currentlyPlaying?.artists?.[0]?.name ?? "";
  const album = currentlyPlaying?.album?.name ?? "";
  const cover = currentlyPlaying?.album?.images?.[0]?.url ?? "";

  useEffect(() => {
    if (!isPremium || !player) return;
    (player as Spotify.Player).getCurrentState().then((state) => {
      if (state) {
        setLyricsProgressMs(state.position);
      }
    });

    (player as Spotify.Player).on("player_state_changed", (state) => {
      if (state) {
        setLyricsProgressMs(state.position);
      }
    });
  }, [player, isPremium, setLyricsProgressMs]);

  useLayoutEffect(() => {
    if (!requestLyrics) return;
    const newLyricsBackgroundColor = lyrics?.colors?.background
      ? rgbToHex(colorCodedToRGB(lyrics.colors.background))
      : lyricsBackgroundColor ?? getRandomColor();
    const [h, s, l] = hexToHsl(newLyricsBackgroundColor, true) ?? [];
    setLyricLineColor(
      lyrics?.colors?.highlightText
        ? colorCodedToHex(lyrics.colors.highlightText)
        : lyricLineColor ?? `hsl(${h}, ${s}%, ${l - 20}%)`
    );
    setLyricTextColor(
      lyrics?.colors?.text
        ? rgbToHex(colorCodedToRGB(lyrics.colors.text))
        : lyricTextColor ?? `hsl(${h}, ${s}%, ${l - 20}%)`
    );

    if (currentlyPlaying?.type !== "track")
      return setDisplayInFullScreen(DisplayInFullScreen.App);
    setLyricsBackgroundColor(newLyricsBackgroundColor);
  }, [
    lyricsBackgroundColor,
    lyricLineColor,
    lyricTextColor,
    currentlyPlaying?.type,
    lyrics?.colors,
    setDisplayInFullScreen,
    setLyricLineColor,
    setLyricTextColor,
    setLyricsBackgroundColor,
    requestLyrics,
  ]);

  useEffect(() => {
    if (!isPlaying || !currentlyPlayingDuration || !requestLyrics) {
      return;
    }
    const minimumIntervalCheck = 200;
    const playerCallBackInterval = setInterval(() => {
      setLyricsProgressMs((value) =>
        value >= currentlyPlayingDuration ? 0 : value + minimumIntervalCheck
      );
    }, minimumIntervalCheck);

    return () => {
      clearInterval(playerCallBackInterval);
    };
  }, [isPlaying, setLyricsProgressMs, currentlyPlayingDuration, requestLyrics]);

  useEffect(() => {
    if (!isPictureInPictureLyircsCanvas || !pictureInPictureCanvas.current)
      return;
    const ctx = pictureInPictureCanvas.current.getContext("2d");
    const canvasWidth = pictureInPictureCanvas.current.width;
    const canvasHeight = pictureInPictureCanvas.current.height;
    if (!ctx) return;
    const lines = lyrics?.lines;
    ctx.font = "24px Arial";

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = 40;
    const lineWidth = 10;
    const numSegments = 120;
    const segmentAngle = (2 * Math.PI) / numSegments;
    const rotationSpeed = 0.05;
    let rotation = 0;

    function drawLoadingSpinner(rotation: number) {
      if (!ctx) return;
      const [h, s] = hexToHsl(lyricsBackgroundColor ?? "#ccacaa", true) ?? [
        0, 0, 0,
      ];

      for (let i = 0; i < numSegments; i++) {
        const startAngle = i * segmentAngle + rotation;
        const endAngle = startAngle + segmentAngle;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = lineWidth;

        const minLightness = 30;
        const maxLightness = 60;
        const adjustedLightness =
          minLightness + (i * (maxLightness - minLightness)) / numSegments;

        const segmentColor = `hsl(${h}, ${s}%, ${adjustedLightness}%)`;
        ctx.strokeStyle = segmentColor;
        ctx.globalCompositeOperation = "source-over";
        ctx.stroke();
      }
    }

    function animate() {
      drawLoadingSpinner(rotation);
      rotation += rotationSpeed;
      const frame = requestAnimationFrame(animate);
      setSpinnerFrame(frame);
    }

    if (!lyricsError && !lines && !spinnerFrame) {
      animate();
      return;
    }

    if (spinnerFrame && (lines || lyricsError)) {
      cancelAnimationFrame(spinnerFrame);
      setSpinnerFrame(null);
    }
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = lyricsBackgroundColor ?? "#000";

    ctx.fillRect(
      0,
      0,
      pictureInPictureCanvas.current.width,
      pictureInPictureCanvas.current.height
    );
  }, [
    spinnerFrame,
    isPictureInPictureLyircsCanvas,
    lyrics?.lines,
    lyricsBackgroundColor,
    lyricsError,
    pictureInPictureCanvas,
  ]);

  useEffect(() => {
    if (
      !isPictureInPictureLyircsCanvas ||
      !pictureInPictureCanvas.current ||
      !requestLyrics
    )
      return;
    const lines = lyrics?.lines;
    const ctx = pictureInPictureCanvas.current.getContext("2d");
    const canvasWidth = pictureInPictureCanvas.current.width;
    const canvasHeight = pictureInPictureCanvas.current.height;
    if (!ctx) return;
    const lyricsContainerHeight = canvasHeight - LYRICS_PIP_HEADER_HEIGH;

    ctx.clearRect(
      0,
      LYRICS_PIP_HEADER_HEIGH,
      canvasWidth,
      lyricsContainerHeight
    );
    ctx.font = "24px Arial";

    const canvasMiddle = lyricsContainerHeight / 2;
    if (lyricsError || !lines) {
      ctx.fillStyle = lyricTextColor;
      ctx.fillText(lyricsError ?? "", LYRICS_PADDING_LEFT, canvasMiddle);
    }

    const allLines = getAllLinesFittingWidth({
      ctx,
      lines: lines ?? [],
      lyricLineColor,
      lyricsProgressMs,
      lyricTextColor,
      canvasWidth,
    });

    applyLyricLinePositionAndColor(ctx, allLines, lyricsContainerHeight);

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = lyricsBackgroundColor ?? "#000";

    ctx.fillRect(
      0,
      0,
      pictureInPictureCanvas.current.width,
      pictureInPictureCanvas.current.height
    );
  }, [
    lyricsError,
    lyricsProgressMs,
    isPictureInPictureLyircsCanvas,
    lyricLineColor,
    lyricTextColor,
    lyricsBackgroundColor,
    pictureInPictureCanvas,
    lyrics?.lines,
    requestLyrics,
  ]);

  useEffect(() => {
    if (
      !isPictureInPictureLyircsCanvas ||
      !pictureInPictureCanvas.current ||
      !requestLyrics
    )
      return;
    const ctx = pictureInPictureCanvas.current.getContext("2d");
    if (!ctx) {
      return;
    }
    const drawImage = async (url: string) => {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = url;
      await image.decode();
      ctx?.clearRect(10, 10, 80, 80);
      ctx?.drawImage(image, 10, 10, 80, 80);
    };
    ctx.clearRect(0, 0, 10, 100);
    ctx.clearRect(10, 90, pictureInPictureCanvas.current.width, 10);
    ctx.clearRect(0, 0, pictureInPictureCanvas.current.width, 10);
    ctx.clearRect(90, 0, pictureInPictureCanvas.current.width - 90, 100);

    ctx.font = "22px Arial";
    ctx.fillStyle = lyricTextColor;
    ctx.fillText(title, 100, 30);
    ctx.font = "18px Arial";
    ctx.fillText(artist, 100, 60);
    ctx.font = "16px Arial";
    ctx.fillText(album, 100, 90);
    if (cover) {
      drawImage(cover);
    } else {
      ctx.clearRect(10, 10, 80, 80);
    }

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = lyricsBackgroundColor ?? "#000";

    ctx.fillRect(
      0,
      0,
      pictureInPictureCanvas.current.width,
      pictureInPictureCanvas.current.height
    );
  }, [
    lyricsBackgroundColor,
    title,
    artist,
    album,
    cover,
    isPictureInPictureLyircsCanvas,
    lyrics,
    pictureInPictureCanvas,
    lyricTextColor,
    requestLyrics,
  ]);
}
