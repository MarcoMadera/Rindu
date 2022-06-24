import { useContext } from "react";
import { ISpotifyContext } from "types/spotify";
import SpotifyContext from "../context/SpotifyContext";

export default function useSpotify(): ISpotifyContext {
  const context = useContext(SpotifyContext);

  return context;
}
