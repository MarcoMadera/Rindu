import { ReactElement } from "react";

import { useLottie } from "lottie-react";

import playingAnimation from "animations/playing.json";

export default function Playing(): ReactElement {
  const { View } = useLottie(
    {
      animationData: playingAnimation,
      loop: true,
      autoplay: true,
    },
    {
      width: 36,
      height: 36,
    }
  );
  return View;
}
