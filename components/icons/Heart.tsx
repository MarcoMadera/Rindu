import { CSSProperties, HTMLAttributes, ReactElement } from "react";

import { LottieOptions } from "lottie-react";

import dynamic from "next/dynamic";

import { isServer } from "utils";

const HeartAnimated = dynamic(() => import("./animated/Heart"), {
  ssr: false,
});

export default function Heart(
  props: {
    active: boolean | string;
    handleLike?: () => Promise<true | null>;
    handleDislike?: () => Promise<true | null>;
    options?: LottieOptions;
    style?: CSSProperties;
  } & HTMLAttributes<HTMLButtonElement>
): ReactElement | null {
  if (isServer()) return null;

  return <HeartAnimated {...props} />;
}
