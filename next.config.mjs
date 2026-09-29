const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=(self), fullscreen=*",
  },
];

const immutableAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const avatarAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=86400, stale-while-revalidate=604800",
  },
];

const cachedPublicRoutes = [
  "/icons/:path*",
  "/images/:path*",
  "/projects/:path*",
  "/readme/:path*",
  "/sound/:path*",
  "/files/:path*",
  "/favicon.png",
  "/favicon.webp",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 192, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      ...cachedPublicRoutes.map((source) => ({
        source,
        headers: immutableAssetHeaders,
      })),
      {
        source: "/contacts/avatars/:path*",
        headers: avatarAssetHeaders,
      },
    ];
  },
};

export default nextConfig;
