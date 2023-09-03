import { useContext } from "react";

import LyricsContext, { ILyricsContext } from "context/LyricsContextProvider";

export function useLyricsContext(): ILyricsContext {
  const context = useContext(LyricsContext);
  if (!context)
    throw new Error(
      "useLyricsContext must be used within a LyricsContextProvider"
    );

  return context;
}
