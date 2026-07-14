/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@insurance/ui", "@insurance/lib"],
  images: {
    remotePatterns: []
  }
};

export default nextConfig;
