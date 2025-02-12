import { ReactElement } from "react";

import dynamic from "next/dynamic";

import { isServer } from "utils";

const PlayingAnimated = dynamic(() => import("./animated/Playing"), {
  ssr: false,
});

export default function Playing(): ReactElement | null {
  if (isServer()) return null;

  return <PlayingAnimated />;
}
