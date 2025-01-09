/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "0050cba.netsolhost.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**", // Allows all hosts (if truly necessary)
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "filecache.mediaroom.com",
        pathname: "**", // Allows all paths for this hostname
      },
    ],
  },
};
