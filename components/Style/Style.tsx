import { FC, useEffect } from "react";

import { hashString } from "utils";

interface StyleProps {
  jsx?: boolean;
  global?: boolean;
  children: string;
}

const Style: FC<StyleProps> = ({ jsx = false, global = false, children }) => {
  const normalizedChildren = children.replace(/\s+/g, " ").trim();
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.documentPictureInPicture) return;

    const pipWindow = window.documentPictureInPicture.window;
    if (!pipWindow) return;

    if (!window.documentPictureInPicture._pipStylesAdded) {
      window.documentPictureInPicture._pipStylesAdded = new Set<string>();
    }

    const styleHash = hashString(normalizedChildren);

    if (window.documentPictureInPicture._pipStylesAdded.has(styleHash)) {
      return;
    }

    window.documentPictureInPicture._pipStylesAdded.add(styleHash);

    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-style-id", styleHash);
    styleElement.appendChild(document.createTextNode(normalizedChildren));

    pipWindow.document.head.appendChild(styleElement);

    return () => {
      if (pipWindow && window.documentPictureInPicture?._pipStylesAdded) {
        try {
          const element = pipWindow.document.querySelector(
            `style[data-style-id="${styleHash}"]`
          );
          if (element) {
            pipWindow.document.head.removeChild(element);
            window.documentPictureInPicture._pipStylesAdded.delete(styleHash);
          }
        } catch (e) {
          console.warn("Could not remove style from PiP window");
          if (window.documentPictureInPicture?._pipStylesAdded) {
            window.documentPictureInPicture._pipStylesAdded.delete(styleHash);
          }
        }
      }
    };
  }, [normalizedChildren]);

  return null;
};

export default Style;
