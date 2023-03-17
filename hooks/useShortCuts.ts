import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { DisplayInFullScreen, ITrack } from "types/spotify";

export function useShortCuts({
  ignoreShortcuts,
  setDisplayInFullScreen,
  player,
  currentlyPlaying,
}: {
  ignoreShortcuts: boolean;
  setDisplayInFullScreen: Dispatch<SetStateAction<DisplayInFullScreen>>;
  player: Spotify.Player | AudioPlayer | undefined;
  currentlyPlaying: ITrack | undefined;
}): void {
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (ignoreShortcuts) return;
      if (e.key === "n" && player && typeof player.nextTrack === "function") {
        player.nextTrack();
      }
      if (
        e.key === "b" &&
        player &&
        typeof player.previousTrack === "function"
      ) {
        player.previousTrack();
      }
      if (e.key === "m" && player && typeof player.togglePlay === "function") {
        player.togglePlay();
      }
      if (e.key === "f" || e.key === "p") {
        setDisplayInFullScreen((displayInFullScreen) => {
          if (displayInFullScreen !== DisplayInFullScreen.Player) {
            return DisplayInFullScreen.Player;
          }
          return DisplayInFullScreen.App;
        });
      }
      if (e.key === "Escape") {
        setDisplayInFullScreen(DisplayInFullScreen.App);
      }
      if (e.key === "l" && currentlyPlaying?.type === "track") {
        setDisplayInFullScreen((displayInFullScreen) => {
          if (displayInFullScreen !== DisplayInFullScreen.Lyrics) {
            return DisplayInFullScreen.Lyrics;
          }
          return DisplayInFullScreen.App;
        });
      }
    },
    [currentlyPlaying?.type, ignoreShortcuts, player, setDisplayInFullScreen]
  );

  useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [handleKeyUp]);
}
