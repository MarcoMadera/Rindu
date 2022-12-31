import { useEffect, useState } from "react";

export default function useOnSmallScreen(
  callback?: (isSmall: boolean) => void
): boolean {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 768;
      if (isSmall !== isSmallScreen) {
        setIsSmallScreen(isSmall);
        callback && callback(isSmall);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [callback, isSmallScreen]);

  return isSmallScreen;
}
