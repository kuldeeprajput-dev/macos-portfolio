import {
  PROJECT_1_URL,
  PROJECT_1_GITHUB,
  PROJECT_2_URL,
  PROJECT_2_GITHUB,
  PROJECT_3_URL,
  PROJECT_3_GITHUB,
  PROJECT_4_URL,
  PROJECT_4_GITHUB,
} from "./env";

export const projects = [
  {
    id: 1,
    title: "NewTube",
    description:
      "A modern video streaming application built with Next.js, Tailwind CSS, tRPC, and PostgreSQL.",
    image: "/projects/desktop/newtube.webp",
    link: PROJECT_1_URL,
    github: PROJECT_1_GITHUB,
  },
  {
    id: 2,
    title: "Coursenva",
    description:
      "AI-powered free course finder and custom learning roadmap generator discovering top courses across the web.",
    image: "/projects/desktop/coursenva.webp",
    link: PROJECT_2_URL,
    github: PROJECT_2_GITHUB,
  },
  {
    id: 3,
    title: "Resume Ats Scanner",
    description: "AI-powered resume parsing and analysis platform optimized for ATS.",
    image: "/projects/desktop/resume-ats.webp",
    link: PROJECT_3_URL,
    github: PROJECT_3_GITHUB,
  },
  {
    id: 4,
    title: "Docs Editor",
    description:
      "A powerful, real-time collaborative document editor built with Next.js, Tiptap, Liveblocks, and Convex.",
    image: "/projects/desktop/docs-editor.webp",
    link: PROJECT_4_URL,
    github: PROJECT_4_GITHUB,
  },
];
