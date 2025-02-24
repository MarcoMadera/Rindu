import { ReactElement } from "react";

import { Player, ProgressBar } from "components";
import { useSpotify } from "hooks";

export default function PlayerControls(): ReactElement {
  const { currentlyPlaying } = useSpotify();
  return (
    <>
      <Player />
      <ProgressBar key={currentlyPlaying?.uri} />
    </>
  );
}
