import "@testing-library/jest-dom/extend-expect";
import { beforeAll, afterAll, jest } from "@jest/globals";

process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = "clientId";
process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL =
  "http://localhost:3000/dashboard";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
process.env.SPOTIFY_CLIENT_SECRET = "clientSecret";
process.env.SETLIST_FM_API_KEY = "setlistFmApiKey";
process.env.SPOTIFY_ACCESS_COOKIE = "accessCookie";

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn().mockImplementation(() => ({
    asPath: "/",
    push: jest.fn(),
    query: {
      country: "US",
    },
  })),
}));

beforeAll(() => {
  if (!(typeof window != "undefined" && window.document)) return;
  Object.defineProperty(navigator, "mediaSession", {
    writable: true,
    value: {
      setActionHandler: jest.fn(),
      setPositionState: jest.fn(),
    },
  });

  const toast = document?.createElement("div");
  toast.setAttribute("id", "toast");
  document.body.appendChild(toast);

  const contextMenu = document?.createElement("div");
  contextMenu.setAttribute("id", "contextMenu");
  document.body.appendChild(contextMenu);

  const globalModal = document?.createElement("div");
  globalModal.setAttribute("id", "globalModal");
  document.body.appendChild(globalModal);
});

afterAll(() => {
  if (!(typeof window != "undefined" && window.document)) return;
  const toast = document?.getElementById("toast");
  if (toast) {
    document.body.removeChild(toast);
  }

  const contextMenu = document?.getElementById("contextMenu");
  if (contextMenu) {
    document.body.removeChild(contextMenu);
  }

  const globalModal = document?.getElementById("globalModal");
  if (globalModal) {
    document.body.removeChild(globalModal);
  }
});
