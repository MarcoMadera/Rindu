import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";

import FullScreenLyrics from "components/FullScreenLyrics";
import { useSpotify } from "hooks";

interface PiPStyleWrapperProps {
  pipWindow: Window | null;
  children: ReactNode;
}

const PiPStyleWrapper = ({ pipWindow, children }: PiPStyleWrapperProps) => {
  useEffect(() => {
    if (!pipWindow || !children) return;

    const pipDoc = pipWindow.document;
    const addedStyles = new Set<string>();

    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === "style" && child.props.jsx) {
        const styleContent = child.props.children.trim();
        if (!styleContent || addedStyles.has(styleContent)) return;

        const styleElement = pipDoc.createElement("style");
        styleElement.setAttribute("jsx", "true");
        styleElement.innerHTML = styleContent;

        const styleHash = btoa(styleContent);
        if (
          !pipDoc.head.querySelector(`style[jsx][data-hash="${styleHash}"]`)
        ) {
          styleElement.setAttribute("data-hash", styleHash);
          pipDoc.head.appendChild(styleElement);
          addedStyles.add(styleContent);
        }
      }
    });

    return () => {
      addedStyles.forEach((styleContent) => {
        const styleHash = btoa(styleContent);
        const existingStyle = pipDoc.head.querySelector(
          `style[jsx][data-hash="${styleHash}"]`
        );
        if (existingStyle) {
          pipDoc.head.removeChild(existingStyle);
        }
      });
    };
  }, [pipWindow, children]);

  return <>{children}</>;
};

export const DPIPLyrics = (): ReactElement => {
  const { pipWindow } = useSpotify();
  return (
    <div id={"__next"} className="pipApp" style={{ width: "100%" }}>
      <PiPStyleWrapper>
        <p className="beta-label">Beta</p>
        <FullScreenLyrics document={pipWindow.current?.document} />
        <style global>{`
          body {
            margin: 0;
            padding: 0;
            min-height; 100vh;
            display: flex;
          }
        `}</style>
        <style jsx>{`
          .beta-label {
            font-size: 14px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
            display: inline-block;
            color: #fff;
            border: 1px solid #fff;
            display: flex;
            justify-self: center;
            width: fit-content;
          }
        `}</style>
      </PiPStyleWrapper>
    </div>
  );
};

export default DPIPLyrics;
