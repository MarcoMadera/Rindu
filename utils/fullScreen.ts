declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
    webkitFullscreenEnabled?: boolean;
    mozFullScreenEnabled?: boolean;
    msFullscreenEnabled?: boolean;
  }

  interface HTMLElement {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
  }
}

export function isFullScreen(): boolean {
  return Boolean(
    document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
  );
}

export function requestFullScreen(el: HTMLElement): void {
  if (isFullScreen()) return;
  if (el === undefined) el = document.documentElement;
  if (document.fullscreenEnabled) {
    el.requestFullscreen();
  } else if (document.webkitFullscreenEnabled && el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (document.mozFullScreenEnabled && el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (document.msFullscreenEnabled && el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}

export function exitFullScreen(): void {
  if (!isFullScreen()) return;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
