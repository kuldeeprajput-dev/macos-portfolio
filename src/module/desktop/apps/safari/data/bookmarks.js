import { PROJECT_1_URL, PROJECT_2_URL, PROJECT_3_URL } from "@constants";

export const DEFAULT_BOOKMARKS = [
  {
    id: 1,
    title: "Portfolio",
    url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    img: "/apps/portfolio.webp",
  },
  {
    id: 2,
    title: "NewTube",
    url: PROJECT_1_URL,
    img: "/brands/youtube.webp",
  },
  {
    id: 3,
    title: "Resuvee",
    url: PROJECT_3_URL,
    img: "/projects/desktop/resuvee.webp",
  },
  {
    id: 4,
    title: "Coursenva",
    url: PROJECT_2_URL,
    img: "/projects/desktop/coursenva.webp",
  },
  {
    id: 5,
    title: "Wikipedia",
    url: "https://en.wikipedia.org",
    img: "https://en.wikipedia.org/favicon.ico",
  },
  {
    id: 6,
    title: "OpenStreetMap",
    url: "https://openstreetmap.org",
    img: "/brands/openstreetmap.webp",
  },
];
