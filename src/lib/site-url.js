const configuredSiteUrl = process.env.SITE_URL?.trim();
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const candidate =
  configuredSiteUrl || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

let parsedUrl;

try {
  parsedUrl = new URL(candidate);
} catch {
  throw new Error("SITE_URL must be an absolute URL, such as https://your-site.example.com");
}

if (
  !["http:", "https:"].includes(parsedUrl.protocol) ||
  parsedUrl.username ||
  parsedUrl.password ||
  parsedUrl.pathname !== "/" ||
  parsedUrl.search ||
  parsedUrl.hash ||
  (configuredSiteUrl && process.env.NODE_ENV === "production" && parsedUrl.protocol !== "https:")
) {
  throw new Error("SITE_URL must be an HTTPS origin without a path, query, or fragment");
}

export const siteUrl = parsedUrl.origin;
export const isPreviewDeployment = process.env.VERCEL_ENV === "preview";
export const absoluteSiteUrl = (path = "/") => new URL(path, `${siteUrl}/`).toString();
