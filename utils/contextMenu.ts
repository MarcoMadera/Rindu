import { Dispatch, RefObject, SetStateAction } from "react";

import {
  CONTEXT_MENU_ITEM_HEIGHT,
  CONTEXT_MENU_SIDE_OFFSET,
  CONTEXT_MENU_TOP_BOTTOM_OFFSET,
} from "./constants";
import {
  ICardContentContextMenuData,
  ICardTrackContextMenuData,
} from "types/contextMenu";

export function calculateContextMenuPosition(
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

export function positionContextMenu({
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

export function positionSubMenu(
  subMenuContainer: HTMLDivElement,
  menuContainer: HTMLUListElement,
  items: number,
  hoveredItem: HTMLDivElement
): void {
  const screenHeight = window.innerHeight;
  const menuContainerClientRect = menuContainer.getBoundingClientRect();
  const subMenuContainerClientRect = subMenuContainer.getBoundingClientRect();
  const hoveredItemClientRect = hoveredItem.getBoundingClientRect();
  const subMenuHeight = items * CONTEXT_MENU_ITEM_HEIGHT;

  const calculatedSubMenuTop = calculateSubMenuTop(
    subMenuContainerClientRect,
    subMenuHeight,
    hoveredItemClientRect
  );

  const calculatedSubMenuHeight = calculateSubMenuHeight(
    subMenuHeight,
    screenHeight
  );

  subMenuContainer.style.top = `${calculatedSubMenuTop}px`;
  subMenuContainer.style.height = `${calculatedSubMenuHeight}px`;

  applyTransformTranslation(
    subMenuContainerClientRect,
    menuContainerClientRect,
    subMenuContainer
  );
}

function calculateSubMenuTop(
  subMenuContainerClientRect: DOMRect,
  subMenuHeight: number,
  hoveredItemClientRect: DOMRect
) {
  const inlineBaseHoveredItemWithSubMenuY =
    hoveredItemClientRect.y - subMenuContainerClientRect.y;
  const centeredVerticallyBaseSubMenu =
    inlineBaseHoveredItemWithSubMenuY -
    subMenuHeight / 2 +
    CONTEXT_MENU_ITEM_HEIGHT / 2;

  const isSubMenuOutSideScreenOnTop =
    subMenuHeight / 2 > hoveredItemClientRect.y - CONTEXT_MENU_SIDE_OFFSET;
  const isSubMenuOutSideScreenOnBottom =
    subMenuHeight / 2 >
    window.innerHeight - hoveredItemClientRect.y - CONTEXT_MENU_SIDE_OFFSET;

  if (isSubMenuOutSideScreenOnTop) {
    return -hoveredItemClientRect.y + CONTEXT_MENU_SIDE_OFFSET * 2;
  }

  if (isSubMenuOutSideScreenOnBottom) {
    return window.innerHeight - hoveredItemClientRect.y - subMenuHeight;
  }

  return centeredVerticallyBaseSubMenu;
}

function calculateSubMenuHeight(subMenuHeight: number, screenHeight: number) {
  if (subMenuHeight > screenHeight) {
    return screenHeight - CONTEXT_MENU_TOP_BOTTOM_OFFSET;
  }

  return subMenuHeight;
}

function applyTransformTranslation(
  subMenuContainerClientRect: DOMRect,
  menuContainerClientRect: DOMRect,
  subMenuContainer: HTMLDivElement
) {
  if (subMenuContainerClientRect.right > window.innerWidth) {
    subMenuContainer.style.transform = `translateX(-${
      subMenuContainerClientRect.width + menuContainerClientRect.width
    }px)`;
  }
}
