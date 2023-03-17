import { useContext } from "react";

import SpotifyContext from "context/SpotifyContext";
import { ISpotifyContext } from "types/spotify";

export function useSpotify(): ISpotifyContext {
  const context = useContext(SpotifyContext);

  return context;
}
