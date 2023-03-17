import { useEffect, useState } from "react";

export function useOnSmallScreen(
  callback?: (isSmall: boolean) => void,
  width = 768
): boolean {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < width;
      if (isSmall !== isSmallScreen) {
        setIsSmallScreen(isSmall);
        callback && callback(isSmall);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [callback, isSmallScreen, width]);

  return isSmallScreen;
}
