import { useRouter } from "next/router";
import { MutableRefObject, useEffect } from "react";
import useSpotify from "./useSpotify";

export default function useRouterEvents(
  onAppScroll: () => void,
  appRef?: MutableRefObject<HTMLDivElement | undefined>
): void {
  const router = useRouter();
  const { setShowLyrics } = useSpotify();

  useEffect(() => {
    const app = appRef?.current;

    router.events.on("routeChangeComplete", () => {
      app?.scrollTo(0, 0);
      setShowLyrics.off();
    });

    app?.addEventListener("scroll", onAppScroll);

    return () => {
      router.events.off("routeChangeComplete", () => {
        app?.scrollTo(0, 0);
        setShowLyrics.off();
      });
      app?.removeEventListener("scroll", onAppScroll);
    };
  }, [router, appRef, onAppScroll, setShowLyrics]);
}
