import { ReactElement, useEffect } from "react";

import FullScreenLyrics from "components/FullScreenLyrics";
import { useSpotify } from "hooks";

export const DPIPLyrics = (): ReactElement => {
  const { pipWindow } = useSpotify();
  useEffect(() => {
    if (!pipWindow.current) return;
    const { document: pipDoc } = pipWindow.current;

    pipDoc.documentElement.style.cssText = "";
    pipDoc.body.style.cssText = "";

    pipDoc.body.style.margin = "0";
    pipDoc.body.style.padding = "0";
    pipDoc.body.style.minHeight = "100vh";
    pipDoc.body.style.display = "flex";

    const style = document.createElement("style");
    style.textContent = `
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
    `;
    pipDoc.head.appendChild(style);

    return () => {
      pipDoc.documentElement.style.cssText = "";
      pipDoc.body.style.cssText = "";
      pipDoc.head.removeChild(style);
    };
  }, [pipWindow]);

  return (
    <div className="pipApp" style={{ width: "100%" }}>
      <p className="beta-label">Beta</p>
      <FullScreenLyrics document={pipWindow.current?.document} />
    </div>
  );
};

export default DPIPLyrics;
