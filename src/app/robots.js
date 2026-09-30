import { absoluteSiteUrl, siteUrl } from "../lib/site-url";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteSiteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
