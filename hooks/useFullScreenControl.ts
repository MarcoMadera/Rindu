import { useState } from "react";
import { DisplayInFullScreen } from "types/spotify";
import useSpotify from "./useSpotify";

export default function useFullScreenControl(
  displayInFullScreen: DisplayInFullScreen
): {
  setDisplayInFullScreen: (visible: boolean) => void;
} {
  const { setDisplayInFullScreen } = useSpotify();
  const [lastDisplayFullScreen, setLastDisplayFullScreen] =
    useState<DisplayInFullScreen>(displayInFullScreen);

  return {
    setDisplayInFullScreen: (visible: boolean) => {
      setDisplayInFullScreen(
        visible ? lastDisplayFullScreen : DisplayInFullScreen.App
      );
      setLastDisplayFullScreen(displayInFullScreen);
    },
  };
}
