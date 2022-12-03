import { Dispatch, SetStateAction, useEffect } from "react";
import useAuth from "./useAuth";
import { AudioPlayer } from "./useSpotifyPlayer";

export default function useReconnectSpotifyPlayer({
  reconnect,
  player,
  setReconnectionError,
}: {
  reconnect: boolean;
  player: Spotify.Player | AudioPlayer | undefined;
  setReconnectionError: Dispatch<SetStateAction<boolean>>;
}): void {
  const { user } = useAuth();
  const isPremium = user?.product === "premium";

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
