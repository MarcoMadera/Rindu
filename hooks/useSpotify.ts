import { useCustomContext } from "./useCustomContext";
import SpotifyContext from "context/SpotifyContext";
import { ISpotifyContext } from "types/spotify";

export function useSpotify(): ISpotifyContext {
  const context = useCustomContext(SpotifyContext);

  return context;
}
