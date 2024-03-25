/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @type {import('next').NextConfig}
 **/

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: "assets.fanart.tv",
      },
    ],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    localeDetection: false,
  },
};

export default nextConfig;
