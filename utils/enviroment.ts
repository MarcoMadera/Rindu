export const getSiteUrl = (): string | undefined =>
  isProduction() ? process.env.NEXT_PUBLIC_SITE_URL : "http://localhost:3000";
export const isProduction = (): boolean =>
  process.env.NODE_ENV === "production";
export const isServer = (): boolean =>
  !(typeof window != "undefined" && window.document);
