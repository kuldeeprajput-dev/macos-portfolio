import { GITHUB_PROFILE, TWITTER_URL, LINKEDIN_URL, PORTFOLIO_URL } from "./env";

export const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: GITHUB_PROFILE,
    img: "/images/github.webp",
  },
  {
    id: 2,
    text: "Portfolio",
    icon: "/icons/atom.svg",
    bg: "#4bcb63",
    link: PORTFOLIO_URL,
    img: "/images/portfolio.webp",
  },
  {
    id: 3,
    text: "Twitter/X",
    icon: "/icons/twitter.svg",
    bg: "#ff866b",
    link: TWITTER_URL,
    img: "/images/x.webp",
  },
  {
    id: 4,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: LINKEDIN_URL,
    img: "/images/linkedin.webp",
  },
];
