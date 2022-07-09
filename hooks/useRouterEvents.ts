import { useRouter } from "next/router";
import { MutableRefObject, useEffect } from "react";
import useHeader from "./useHeader";
import useSpotify from "./useSpotify";

export default function useRouterEvents(
  onAppScroll: () => void,
  appRef?: MutableRefObject<HTMLDivElement | undefined>
): void {
  const router = useRouter();
  const { alwaysDisplayColor, setHeaderOpacity } = useHeader();
  const { setShowLyrics } = useSpotify();

  useEffect(() => {
    const app = appRef?.current;

    router.events.on("routeChangeComplete", () => {
      app?.scrollTo(0, 0);
      setShowLyrics.off();
      if (!alwaysDisplayColor) {
        setHeaderOpacity(0);
      }
    });

    app?.addEventListener("scroll", onAppScroll);

    return () => {
      router.events.off("routeChangeComplete", () => {
        app?.scrollTo(0, 0);
        setShowLyrics.off();
        setHeaderOpacity(0);
      });
      app?.removeEventListener("scroll", onAppScroll);
    };
  }, [
    router,
    alwaysDisplayColor,
    setHeaderOpacity,
    appRef,
    onAppScroll,
    setShowLyrics,
  ]);
}
