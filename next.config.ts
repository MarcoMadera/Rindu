/**
 * @type {import('next').NextConfig}
 **/

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "assets.fanart.tv",
      },
    ],
  },
};

export default nextConfig;
