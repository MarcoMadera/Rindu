import "@testing-library/jest-dom/extend-expect";

process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = "clientId";
process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL =
  "http://localhost:3000/dashboard";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
process.env.SPOTIFY_CLIENT_SECRET = "clientSecret";
process.env.SETLIST_FM_API_KEY = "setlistFmApiKey";
process.env.SPOTIFY_ACCESS_COOKIE = "accessCookie";
