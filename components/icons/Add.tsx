import { ReactElement, SVGProps } from "react";

import dynamic from "next/dynamic";

const AddAnimated = dynamic(() => import("./animated/Add"), {
  ssr: false,
});

export function Add(
  props: SVGProps<SVGSVGElement> & {
    handleClick?: () => Promise<boolean>;
    isAdded?: boolean;
    shouldUpdateList?: boolean;
  }
): ReactElement | null {
  return <AddAnimated {...props} />;
}
