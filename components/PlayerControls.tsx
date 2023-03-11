import { ReactElement } from "react";

import { Player, ProgressBar } from "components";

export default function PlayerControls(): ReactElement {
  return (
    <>
      <Player />
      <ProgressBar />
    </>
  );
}
