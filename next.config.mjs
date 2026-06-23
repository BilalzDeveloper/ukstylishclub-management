/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Shopify CDN serves product/catalog images
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default nextConfig;
