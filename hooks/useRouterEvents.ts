import { MutableRefObject, useEffect } from "react";

import { useRouter } from "next/router";

import { useModal, useSpotify } from "hooks";
import { DisplayInFullScreen } from "types/spotify";

export function useRouterEvents(
  onAppScroll: () => void,
  appRef?: MutableRefObject<HTMLDivElement | undefined>
): void {
  const router = useRouter();
  const { setDisplayInFullScreen } = useSpotify();
  const { setModalData } = useModal();

  useEffect(() => {
    const app =
      appRef?.current ??
      document.querySelector("#right .simplebar-content-wrapper");

    const handleRouteChange = () => {
      app?.scrollTo(0, 0);
      setDisplayInFullScreen(DisplayInFullScreen.App);
      setModalData(null);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    app?.addEventListener("scroll", onAppScroll);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      app?.removeEventListener("scroll", onAppScroll);
    };
  }, [router, appRef, onAppScroll, setDisplayInFullScreen, setModalData]);
}
