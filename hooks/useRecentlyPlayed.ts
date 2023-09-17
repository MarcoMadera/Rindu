import { Dispatch, SetStateAction, useEffect } from "react";

import { useAuth } from "hooks";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { ITrack } from "types/spotify";

export function useRecentlyPlayed({
  setRecentlyPlayed,
  currentlyPlaying,
  playedSource,
  setVolume,
  player,
}: {
  setRecentlyPlayed: Dispatch<SetStateAction<ITrack[]>>;
  currentlyPlaying: ITrack | undefined;
  playedSource: string | undefined;
  player: Spotify.Player | AudioPlayer | undefined;
  setVolume: Dispatch<SetStateAction<number>>;
}): void {
  const { user, isPremium } = useAuth();

  useEffect(() => {
    if (!playedSource || !user?.id) return;
    const type = playedSource.split(":")[1];
    if (type === "track" && currentlyPlaying) {
      setRecentlyPlayed((prev) => {
        if (prev.some((el) => el.uri === currentlyPlaying.uri)) {
          localStorage.setItem(
            `${user.id}:recentlyPlayed`,
            JSON.stringify(prev)
          );
          return prev;
        }

        if (prev.length === 10) {
          const newRecentlyPlayedwithLimit = [
            currentlyPlaying,
            ...prev.slice(0, -1),
          ];
          localStorage.setItem(
            `${user.id}:recentlyPlayed`,
            JSON.stringify(newRecentlyPlayedwithLimit)
          );
          return newRecentlyPlayedwithLimit;
        }
        const newRecentlyPlayed = [currentlyPlaying, ...prev];
        localStorage.setItem(
          `${user.id}:recentlyPlayed`,
          JSON.stringify(newRecentlyPlayed)
        );

        return newRecentlyPlayed;
      });
    }
  }, [playedSource, currentlyPlaying, user?.id, setRecentlyPlayed]);

  useEffect(() => {
    if (!user?.id) return;
    const playback = localStorage.getItem("playback");
    const recentlyPlayedFromLocal = localStorage.getItem(
      `${user.id}:recentlyPlayed`
    );
    if (playback) {
      const playbackObj = JSON.parse(decodeURI(playback)) as { volume: number };
      setVolume(playbackObj.volume);
      if (isPremium && player) {
        (player as Spotify.Player).on("ready", () => {
          player?.setVolume(playbackObj.volume);
        });
      } else {
        player?.setVolume(playbackObj.volume);
      }
    }
    if (recentlyPlayedFromLocal) {
      const recentlyPlayedObj = JSON.parse(recentlyPlayedFromLocal) as ITrack[];
      setRecentlyPlayed(recentlyPlayedObj);
    }
  }, [isPremium, player, setRecentlyPlayed, setVolume, user?.id]);
}
