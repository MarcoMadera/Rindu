import { AudioPlayer } from "hooks";
import { ITrack } from "types/spotify";

export function getAudioPlayerNextPlayableTrack(
  audioPlayer: AudioPlayer
): ITrack | null {
  const allTracks = audioPlayer.allTracks;
  const currentTrackIndex = allTracks?.findIndex(
    ({ preview_url }) => preview_url === audioPlayer?.src
  );
  const nextTrackIndex = (currentTrackIndex ?? -1) + 1;
  let nextTrack: ITrack | null = null;
  for (
    let index = nextTrackIndex;
    index < (allTracks ? allTracks.length : 0);
    index++
  ) {
    const previewUrl = allTracks[index]?.preview_url;
    if (previewUrl) {
      nextTrack = allTracks[index];
      break;
    }
  }

  return nextTrack;
}
