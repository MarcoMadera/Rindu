import { ReactElement } from "react";

import dynamic from "next/dynamic";

import { VirtualizedListProps } from "./VirtualList";
const VirtualizedList = dynamic(() => import("./VirtualList"), {
  ssr: false,
}) as <T>(props: Readonly<VirtualizedListProps<T>>) => ReactElement | null;

export default function VirtualList<T>(
  props: Readonly<VirtualizedListProps<T>>
): ReactElement | null {
  return <VirtualizedList {...props} />;
}
