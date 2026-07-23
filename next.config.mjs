/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output keeps the container image small and lets any host run
  // `node server.js` (Docker / Render / Fly / Railway). See docs/deploy.md.
  output: "standalone",
  // Shopify CDN serves product/catalog images
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default nextConfig;
