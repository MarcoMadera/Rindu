import { Dispatch, SetStateAction, useEffect } from "react";

import { useAuth } from "hooks";
import { AudioPlayer } from "hooks/useSpotifyPlayer";

export function useReconnectSpotifyPlayer({
  reconnect,
  player,
  setReconnectionError,
}: {
  reconnect: boolean;
  player: Spotify.Player | AudioPlayer | undefined;
  setReconnectionError: Dispatch<SetStateAction<boolean>>;
}): void {
  const { isPremium } = useAuth();

  useEffect(() => {
    if (!reconnect || !isPremium) return;
    const timer = setTimeout(() => {
      (player as Spotify.Player).connect();
      setReconnectionError(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isPremium, player, reconnect, setReconnectionError]);
}
