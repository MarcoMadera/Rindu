import { AudioPlayer } from "hooks";
import { ITrack } from "types/spotify";

export function getAudioPlayerPreviousPlayableTrack(
  audioPlayer: AudioPlayer
): ITrack | null {
  const allTracks = audioPlayer.allTracks;
  const currentTrackIndex = allTracks.findIndex(
    ({ preview_url }) => preview_url === audioPlayer.src
  );
  let previousTrackIndex = (currentTrackIndex ?? -1) - 1;
  let previousTrack: ITrack | null = null;

  while (previousTrackIndex >= 0) {
    const previewUrl = allTracks[previousTrackIndex]?.preview_url;
    if (previewUrl) {
      previousTrack = allTracks[previousTrackIndex];
      break;
    }
    previousTrackIndex--;
  }

  return previousTrack;
}
