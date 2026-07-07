export const PROJECT_1_URL = process.env.NEXT_PUBLIC_PROJECT_1_URL;
export const PROJECT_1_GITHUB = process.env.NEXT_PUBLIC_PROJECT_1_GITHUB;
export const PROJECT_2_URL = process.env.NEXT_PUBLIC_PROJECT_2_URL;
export const PROJECT_2_GITHUB = process.env.NEXT_PUBLIC_PROJECT_2_GITHUB;
export const PROJECT_3_URL = process.env.NEXT_PUBLIC_PROJECT_3_URL;
export const PROJECT_3_GITHUB = process.env.NEXT_PUBLIC_PROJECT_3_GITHUB;
export const PROJECT_4_URL = process.env.NEXT_PUBLIC_PROJECT_4_URL;
export const PROJECT_4_GITHUB = process.env.NEXT_PUBLIC_PROJECT_4_GITHUB;
export const GITHUB_PROFILE = process.env.NEXT_PUBLIC_GITHUB_PROFILE;
export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL;
export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL;
export const GITHUB_USERNAME = GITHUB_PROFILE
  ? GITHUB_PROFILE.replace(/\/+$/, "").split("/").pop()
  : "kuldeeprajput-dev";

export const PORTFOLIO_URL = process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://kuldeeprajput.in";
export const PORTFOLIO_ALT_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_ALT_URL || "https://kuldeep-rajput.vercel.app/";
export const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "contact.kuldeeprajput@gmail.com";
export const PHONE = process.env.NEXT_PUBLIC_PHONE || "+91 0000000000";
