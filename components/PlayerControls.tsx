import { ReactElement } from "react";
import Player from "./Player";
import { ProgressBar } from "./ProgressBar";

export default function PlayerControls(): ReactElement {
  return (
    <>
      <Player />
      <ProgressBar />
    </>
  );
}
