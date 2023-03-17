import { useState } from "react";

import { useSpotify } from "hooks";
import { DisplayInFullScreen } from "types/spotify";

export function useFullScreenControl(
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
