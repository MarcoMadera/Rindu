import { useLottie } from "lottie-react";
import { ReactElement } from "react";
import playingAnimation from "animations/playing.json";

export function Playing(): ReactElement {
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
  return <>{View}</>;
}
