import { Dispatch, RefObject, SetStateAction } from "react";

import {
  ICardContentContextMenuData,
  ICardTrackContextMenuData,
} from "types/contextMenu";

export function calculatePosition(
  isOffScreen: boolean,
  maxEdgePosition: number,
  position: number,
  defaultValue: number
): number {
  if (isOffScreen) {
    return maxEdgePosition;
  }

  if (!position || position < 45) {
    return defaultValue;
  }

  return position;
}

const isOffScreenWidth = (x: number, width: number) => {
  return x + width > window.innerWidth;
};

const isOffScreenHeight = (y: number, height: number) => {
  return y + height > window.innerHeight;
};

const calculateOffScreenWidth = (width: number, offset = 0) => {
  return window.innerWidth - width - offset;
};

const calculateOffScreenHeight = (height: number, offset = 0) => {
  return window.innerHeight - height - offset;
};

interface IHandlePositioning {
  positionData:
    | ICardTrackContextMenuData
    | ICardContentContextMenuData
    | undefined;
  elementRef: RefObject<HTMLElement>;
  setPosition: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  setIsOffScreen: Dispatch<
    SetStateAction<{
      x: boolean;
      y: boolean;
    }>
  >;
  offsets?: {
    x: number;
    y: number;
  };
}

export function handlePositioning({
  positionData,
  elementRef,
  setPosition,
  setIsOffScreen,
  offsets,
}: IHandlePositioning): void {
  if (!positionData?.position?.x || !positionData?.position?.y) {
    setIsOffScreen({ x: false, y: false });
    return;
  }

  const contextMenuRect = elementRef.current?.getBoundingClientRect();
  if (!contextMenuRect) return;

  const isContextMenuWidthOffScreen = isOffScreenWidth(
    positionData.position.x,
    contextMenuRect.width
  );
  const isContextMenuHeightOffScreen = isOffScreenHeight(
    positionData.position.y,
    contextMenuRect.height
  );

  setIsOffScreen({
    x: isContextMenuWidthOffScreen,
    y: isContextMenuHeightOffScreen,
  });

  if (isContextMenuWidthOffScreen) {
    setPosition((prevState) => ({
      ...prevState,
      x: calculateOffScreenWidth(contextMenuRect.width, offsets?.x),
    }));
  }
  if (isContextMenuHeightOffScreen) {
    setPosition((prevState) => ({
      ...prevState,
      y: calculateOffScreenHeight(contextMenuRect.height, offsets?.y),
    }));
  }
}
