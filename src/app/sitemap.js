import { absoluteSiteUrl } from "../lib/site-url";

export default function sitemap() {
  return [{ url: absoluteSiteUrl("/") }];
}
