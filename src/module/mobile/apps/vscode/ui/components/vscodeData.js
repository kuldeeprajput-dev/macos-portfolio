export const INITIAL_FILES = {
  "src/App.jsx": `import React from 'react';

export default function App() {
  return (
    <div className="portfolio">
      <h1>Welcome to my macOS Portfolio</h1>
      <p>Explore my projects and skills using the desktop apps!</p>
    </div>
  );
}`,
  "src/index.css": `:root {
  --primary: #007acc;
  --background: #1e1e1e;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--background);
}`,
  "package.json": `{
  "name": "macos-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "next",
    "build": "next build"
  },
  "dependencies": {
    "react": "^19.2.0",
    "tailwindcss": "^4.1.17"
  }
}`,
  "README.md": `# macOS Portfolio Simulation

This is an interactive macOS desktop portfolio simulation built with React, Vite, Tailwind CSS, and GSAP.

## Features
- Fully draggable and resizable windows
- Safari browser with interactive profile sites
- Safari with clickable favorite bookmarks
- Integrated VS Code editor (you are here!)

## Get Started
Run the dev server:
\`\`\`bash
bun run dev
\`\`\`
`,
};

export const extensionsList = [
  {
    name: "GitHub Copilot",
    desc: "Your AI pair programmer",
    publisher: "GitHub",
    version: "v1.254",
  },
  { name: "Prettier", desc: "Opinionated code formatter", publisher: "Prettier", version: "v10.2" },
  {
    name: "Tailwind CSS IntelliSense",
    desc: "Intelligent Tailwind CSS tooling",
    publisher: "Tailwind Labs",
    version: "v0.11",
  },
  {
    name: "GitLens",
    desc: "Supercharge Git within VS Code",
    publisher: "GitKraken",
    version: "v15.0",
  },
];
