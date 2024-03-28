import { ReactElement } from "react";

import { Pause, Play, Playing } from "components/icons";

interface IPlayButtonIcon {
  mouseEnter: boolean;
  isTheSameAsCurrentlyPlaying: boolean;
  isPlaying: boolean;
  isFocusing: boolean;
  isPlayable?: boolean | string;
  visualPosition?: number;
  position?: number;
}
export function PlayButtonIcon({
  mouseEnter,
  isTheSameAsCurrentlyPlaying,
  isPlaying,
  isFocusing,
  isPlayable,
  visualPosition,
  position,
}: Readonly<IPlayButtonIcon>): ReactElement {
  if (mouseEnter && isTheSameAsCurrentlyPlaying && isPlaying) {
    return <Pause size={24} fill={"#FFF"} />;
  }

  if (isTheSameAsCurrentlyPlaying && isPlaying) {
    return <Playing />;
  }

  if ((mouseEnter || isFocusing) && isPlayable) {
    return <Play fill="#FFF" />;
  }

  return (
    <span className="position">{`${
      visualPosition ?? (typeof position === "number" ? position + 1 : "")
    }`}</span>
  );
}
