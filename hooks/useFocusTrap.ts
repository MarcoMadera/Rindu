import { useEffect } from "react";

export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>
): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const containerElement = containerRef.current;
      const firstFocusableElement = containerElement?.querySelector(
        "[tabindex='0']"
      ) as HTMLElement | null;
      const lastFocusableElement = containerElement?.querySelectorAll(
        "[tabindex]:not([tabindex='-1'])"
      )[
        containerElement?.querySelectorAll("[tabindex]:not([tabindex='-1'])")
          .length - 1
      ] as HTMLElement | null;
      if (event.key !== "Tab") return;

      if (!event.shiftKey && event.target === lastFocusableElement) {
        firstFocusableElement?.focus();
        event.preventDefault();
      }

      if (event.shiftKey && event.target === firstFocusableElement) {
        lastFocusableElement?.focus();
        event.preventDefault();
      }
    };

    containerRef.current?.focus();

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef]);
};
