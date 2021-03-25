export const __prod__ = process.env.NODE_ENV === "production";
export const __isServer__ = !(typeof window != "undefined" && window.document);
export const ACCESSTOKENCOOKIE = "qs";
export const REFRESHTOKENCOOKIE = "rs";
export const EXPIRETOKENCOOKIE = "ex";
export const SITE_URL = __prod__
  ? process.env.SITE_URL
  : "http://localhost:3000";
