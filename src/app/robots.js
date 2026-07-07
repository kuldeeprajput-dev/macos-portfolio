const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");
const SITE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://macos-kuldeeprajput.vercel.app",
);

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
