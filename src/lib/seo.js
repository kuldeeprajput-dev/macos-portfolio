import { TWITTER_URL } from "../constants/env";
import { absoluteSiteUrl } from "./site-url";

export const OWNER_NAME = "Kuldeep Rajput";
export const SITE_NAME = `${OWNER_NAME} | macOS Portfolio`;
export const SITE_DESCRIPTION =
  "Explore Kuldeep Rajput's macOS-inspired developer portfolio, featured projects, skills, and interactive desktop apps.";

const previewImage = absoluteSiteUrl("/og-image/og-image.png");
const twitterHandle = new URL(TWITTER_URL).pathname.split("/").filter(Boolean)[0];

export function pageMetadata({ path = "/", title = SITE_NAME, description = SITE_DESCRIPTION }) {
  const socialTitle = title === SITE_NAME ? title : `${title} | ${OWNER_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: absoluteSiteUrl(path) },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: absoluteSiteUrl(path),
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images: [
        {
          url: previewImage,
          width: 1629,
          height: 965,
          alt: "Kuldeep Rajput's macOS portfolio desktop preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [previewImage],
      creator: twitterHandle ? `@${twitterHandle}` : undefined,
    },
  };
}
