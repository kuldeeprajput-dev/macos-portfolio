import { PORTFOLIO_URL } from "@constants/env";

const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");
const SITE_URL = trimTrailingSlash(PORTFOLIO_URL);

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
