export const INITIAL_FILES = {
  "src/App.jsx": `import React from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import AboutMe from './components/AboutMe';

export default function Portfolio() {
  return (
    <div className="portfolio min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full py-4 border-b border-zinc-900 bg-[#0a0a0a]/80 backdrop-blur-md px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-bold text-sm tracking-tight text-white uppercase">Kuldeep Rajput</span>
        </div>
        <nav className="flex gap-6 text-xs font-semibold text-zinc-400">
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Collaborate</a>
        </nav>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">
        <Hero />
        <Projects />
        <AboutMe />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900 text-center text-xs text-zinc-500">
        <p>© 2026 Kuldeep Rajput. Built with Next.js, React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}`,
  "src/components/Hero.jsx": `import React from 'react';

export default function Hero() {
  return (
    <section className="py-12 space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
        🚀 Software Engineer
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
        I build modern, scalable web applications
      </h1>
      <p className="text-base text-zinc-400 leading-relaxed max-w-2xl">
        I am <span className="text-white font-medium">Kuldeep Rajput</span>. I design high-performance full-stack architectures and robust AI integrations using Next.js, React, and Tailwind CSS.
      </p>
      <div className="flex flex-wrap gap-4 pt-2">
        <a 
          href="https://cal.com/kuldeep-kd6ity" 
          target="_blank" 
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
        >
          Schedule Call
        </a>
        <a 
          href="mailto:contact.kuldeeprajput@gmail.com" 
          className="px-5 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold transition-all active:scale-95"
        >
          Send Email
        </a>
      </div>
    </section>
  );
}`,
  "src/components/Projects.jsx": `import React from 'react';

const SELECTED_PROJECTS = [
  {
    title: "NEWTUBE",
    desc: "A modern, full-stack video sharing platform built with Next.js 15, Mux, and tRPC.",
    tech: ["Next.js 15", "Mux", "tRPC", "PostgreSQL"],
    rating: "4.9"
  },
  {
    title: "DOCS EDITOR",
    desc: "A powerful, real-time collaborative document editor built with modern web technologies.",
    tech: ["React", "Liveblocks", "TipTap Editor", "Next.js"],
    rating: "4.8"
  },
  {
    title: "RESUME ANALYZER",
    desc: "AI-powered tool that evaluates resumes against ATS systems and provides actionable feedback.",
    tech: ["Gemini AI", "Next.js", "Tailwind CSS", "PDF Parser"],
    rating: "4.9"
  },
  {
    title: "FREE COURSE",
    desc: "AI-powered learning discovery platform that finds free courses across the web.",
    tech: ["Next.js", "AI Search Engine", "Tailwind CSS"],
    rating: "4.7"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Selected Projects</h2>
        <p className="text-xs text-zinc-500 mt-1">Digital creations focusing on speed, performance, and user experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SELECTED_PROJECTS.map((p, i) => (
          <div key={i} className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-zinc-700 transition-colors duration-300 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-extrabold text-white tracking-widest uppercase">{p.title}</h3>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-semibold">★ {p.rating}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed min-h-[40px]">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.tech.map((t, idx) => (
                <span key={idx} className="text-[9px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded border border-zinc-800/50">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}`,
  "src/components/AboutMe.jsx": `import React from 'react';

export default function AboutMe() {
  return (
    <section id="about" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-zinc-900">
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Education</h3>
        <h4 className="text-sm font-bold text-white uppercase">Bachelor of Computer Applications</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Specialized in software engineering and modern web architectures, focusing on scalable product development.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Focus & Vision</h3>
        <h4 className="text-sm font-bold text-white uppercase">Clean Architecture & AI</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Prioritizing performance, clean architecture, and exploring the intersection of AI integration with web interactivity.
        </p>
      </div>

      <div className="space-y-3" id="contact">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Social Channels</h3>
        <h4 className="text-sm font-bold text-white uppercase">Let's Connect</h4>
        <div className="flex flex-col gap-2 pt-1">
          <a href="https://github.com/kuldeeprajput-dev" target="_blank" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5">
            📁 GitHub /kuldeeprajput-dev
          </a>
          <a href="https://www.linkedin.com/in/kuldeepdotcom/" target="_blank" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5">
            💼 LinkedIn /in/kuldeepdotcom
          </a>
          <a href="https://x.com/kuldeepdotcom" target="_blank" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5">
            🐦 Twitter @kuldeepdotcom
          </a>
        </div>
      </div>
    </section>
  );
}`,
  "src/index.css": `:root {
  --primary: #007acc;
  --background: #0a0a0a;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, sans-serif;
  background-color: var(--background);
  color: #f3f3f3;
}`,
  "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vscode: "#007acc"
      }
    }
  },
  plugins: [],
}`,
  "package.json": `{
  "name": "kuldeep-portfolio-v2",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "react": "^19.2.0",
    "tailwindcss": "^4.1.17",
    "lucide-react": "^0.400.0"
  }
}`,
  "jsconfig.json": `{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"]
    }
  }
}`,
  ".env": `NEXT_PUBLIC_GROQ_API_KEY=gsk_mock_key_12345
PORT=3000
NODE_ENV=development`,
  "README.md": `# Kuldeep Rajput - Portfolio

This is my personal developer portfolio built with React, Next.js, and Tailwind CSS. It highlights my full-stack web applications, tech stack, and digital writing.

## Tech Stack
- **Frontend Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Vanilla styling)
- **AI Integrations:** Gemini & OpenAI SDKs
- **Deployment:** Vercel

## Run Project Locally
Install dependencies:
\`\`\`bash
npm install
\`\`\`

Run local dev server:
\`\`\`bash
npm run dev
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
  {
    name: "ESLint",
    desc: "Integrates ESLint into VS Code",
    publisher: "Microsoft",
    version: "v2.4",
  },
  {
    name: "Dracula Theme",
    desc: "A dark theme for many editors",
    publisher: "Dracula",
    version: "v2.24",
  },
];
