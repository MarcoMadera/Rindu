import LyricsContext, { ILyricsContext } from "context/LyricsContextProvider";
import { useCustomContext } from "hooks";

export function useLyricsContext(): ILyricsContext {
  return useCustomContext(LyricsContext);
}
