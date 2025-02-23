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
    pipDoc.body.style.display = "flex";

    return () => {
      pipDoc.documentElement.style.cssText = "";
      pipDoc.body.style.cssText = "";
    };
  }, [pipWindow]);

  return (
    <div className="pipApp" style={{ width: "100%" }}>
      <FullScreenLyrics document={pipWindow.current?.document} />
    </div>
  );
};

export default DPIPLyrics;
