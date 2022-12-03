export const getSiteUrl = (): string =>
  isProduction()
    ? (process.env.NEXT_PUBLIC_SITE_URL as string)
    : "http://localhost:3000";
export const isProduction = (): boolean =>
  process.env.NODE_ENV === "production";
export const isServer = (): boolean =>
  !(typeof window != "undefined" && window.document);
