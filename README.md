<p align="center">
  <img src="public/favicon.png" alt="macOS Portfolio Logo" width="80" height="80" />
</p>

<h1 align="center">macOS Portfolio</h1>

<p align="center">
  <strong>A pixel-perfect macOS desktop replica built as an interactive developer portfolio</strong>
</p>

<p align="center">
  <a href="https://kuldeeprajput.in">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-make-it-yours">Make It Yours</a> •
  <a href="#-license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/Zustand-5-orange" alt="Zustand" />
  <img src="https://img.shields.io/badge/Groq_AI-Siri_Assistant-purple" alt="Groq AI" />
</p>

---

## 📸 Preview

### Desktop View

<p align="center">
  <img src="public/readme/desktop.png" alt="Desktop View" width="35%" />
  <img src="public/readme/desktop-siri.png" alt="Desktop View with Siri" width="35%" />
</p>

### Mobile View

<p align="center">
  <img src="public/readme/mobile.png" alt="Mobile View" width="18%" />
  <img src="public/readme/mobile-siri.png" alt="Mobile View with Siri" width="18%" />
  <img src="public/readme/mobile-assistive-ball.png" alt="Mobile Assistive Touch" width="18%" />
</p>

---

## ✨ Features

### 🖥️ Core Desktop Experience

| Feature | Description |
|---------|-------------|
| **Boot Sequence** | Realistic macOS boot animation with Apple logo and progress bar |
| **Lock Screen** | Interactive lock screen with click-to-login, session persistence across reloads |
| **Desktop** | Draggable desktop shortcuts, right-click context menu, dynamic wallpapers |
| **Dock** | Animated dock with magnification effect, drag-to-reorder apps, bounce-on-open |
| **Menu Bar** | Functional top navbar with Apple menu, app name, Wi-Fi, Search, User, and Dark Mode toggles |
| **Window Management** | Draggable, resizable windows with minimize, maximize, close — real z-index stacking |
| **Dynamic Notch** | MacBook-style notch with expandable music player and now-playing info |
| **Dark / Light Mode** | System-wide theme toggle that persists across the entire UI |

### 📱 Fully Responsive Mobile Experience

| Feature | Description |
|---------|-------------|
| **iOS-like Home Screen** | Grid-based app launcher mimicking iOS with status bar |
| **Control Center** | Swipe-accessible control center with Wi-Fi, Bluetooth, Brightness, Volume |
| **Assistive Touch** | Floating accessibility button with quick actions |
| **Mobile Dock** | Bottom dock with favorite apps |
| **Status Bar** | Real-time clock, battery, signal indicators |

### 🧩 Built-in Applications (25+ Apps)

| App | Description |
|-----|-------------|
| **Finder** | Portfolio showcase — About, Projects, Experience, Tech Stack, Social links |
| **Safari** | Embedded web browser with address bar and project previews |
| **Terminal** | Fully interactive terminal emulator (xterm.js) with custom commands |
| **Calculator** | Functional macOS-style calculator |
| **Calendar** | Live calendar displaying current month with today highlighted |
| **Weather** | Real-time weather data fetched from wttr.in API |
| **Maps** | Interactive OpenStreetMap integration with location markers |
| **Notes** | Editable notes application |
| **Messages** | iMessage-style messaging interface |
| **Music** | Full music player with Jamendo API — play, pause, skip, shuffle, repeat, volume |
| **Photos / Gallery** | Photo gallery with Library, Memories, Places, and People categories |
| **Contact** | Contact form / contact info display |
| **Resume** | In-browser PDF viewer for your resume |
| **VS Code** | VS Code-styled interface |
| **Postman** | Postman-styled API testing interface |
| **Apple TV** | Movie/show browser powered by TMDB API |
| **App Store** | App Store interface |
| **FaceTime** | FaceTime call interface |
| **Font Book** | Typography showcase |
| **Telegram** | Telegram-style chat interface |
| **Settings** | System preferences — Wi-Fi, Bluetooth, Display, Sound, Battery, Firewall, VPN |
| **Launchpad** | Grid-based app launcher with all installed apps |
| **Projects Folder** | Quick access to all portfolio projects |
| **Trash** | Trash can app |

### 🤖 Siri AI Assistant

- Powered by **Groq AI** (LLaMA model via Groq API)
- Real-time **speech-to-text** transcription
- **Text-to-speech** responses
- Chat-based conversational interface
- Contextual awareness about portfolio owner

### 🎨 UI / UX Details

- **GSAP Animations** — Smooth transitions, draggable elements, and micro-interactions
- **Pixel-perfect Design** — Authentic macOS Sequoia / Sonoma aesthetics
- **WebP Optimized Assets** — All images served in next-gen formats
- **Responsive Breakpoints** — Desktop (≥768px) and Mobile (<768px) layouts
- **Session Persistence** — Login state preserved on page reload

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + PostCSS + Vanilla CSS |
| **Animations** | [GSAP 3](https://gsap.com/) + [@gsap/react](https://gsap.com/docs/v3/GSAP/gsap.registerPlugin()) + Draggable |
| **State Management** | [Zustand 5](https://zustand.docs.pmnd.rs/) + [Immer](https://immerjs.github.io/immer/) |
| **Terminal** | [xterm.js](https://xtermjs.org/) |
| **PDF Viewer** | [react-pdf](https://www.npmjs.com/package/react-pdf) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Dates** | [Day.js](https://day.js.org/) |
| **Tooltips** | [React Tooltip](https://react-tooltip.com/) |
| **AI / LLM** | [Groq SDK](https://groq.com/) (Chat, Speech, Transcription) |
| **Linting** | ESLint 10 + Prettier |
| **Git Hooks** | Husky + lint-staged |
| **Package Manager** | npm / bun |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or **bun** ≥ 1.x)
- **Git**

### Installation

```bash
# 1. Fork the repository (required by license — see License section)

# 2. Clone your fork
git clone https://github.com/<your-github-username>/MacOS-portfolio.git
cd MacOS-portfolio

# 3. Install dependencies
npm install
# or
bun install

# 4. Create your environment file
cp .env.example .env

# 5. Edit .env with your personal details (see Environment Variables section below)

# 6. Add your resume
# Replace the file at public/files/resume.pdf with your own resume

# 7. Start the development server
npm run dev
# or
bun dev
```

The app will be running at **http://localhost:3000**

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start development server with hot reload |
| **Build** | `npm run build` | Create optimized production build |
| **Start** | `npm run start` | Start production server |
| **Lint** | `npm run lint` | Run ESLint on `src/` directory |
| **Format** | `npm run format` | Auto-format all source files with Prettier |
| **Format Check** | `npm run format:check` | Check formatting without modifying files |

---

## 🔐 Environment Variables

Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

Below is the full `.env` file with explanations for every variable:

```env
# ──────────────────────────────────────────────────────────
# 🌐 API BASE URLs (Public Services — No API Key Needed)
# ──────────────────────────────────────────────────────────
# Jamendo music API Client ID — powers the Music app (uses public read ID as default)
NEXT_PUBLIC_JAMENDO_CLIENT_ID=3dce8b55

# Weather API (wttr.in) — powers the Weather app
NEXT_PUBLIC_WEATHER_API_URL=https://wttr.in

# Nominatim geocoding API — used by Maps for location search
NEXT_PUBLIC_NOMINATIM_API_URL=https://nominatim.openstreetmap.org

# OpenStreetMap — powers the Maps app tile rendering
NEXT_PUBLIC_OPENSTREETMAP_URL=https://www.openstreetmap.org

# GitHub REST API — fetches your GitHub profile data and repos
NEXT_PUBLIC_GITHUB_API_URL=https://api.github.com

# ──────────────────────────────────────────────────────────
# 🗂️ PROJECT URLs (Your Portfolio Projects)
# ──────────────────────────────────────────────────────────
# Each project has a live URL and a GitHub repository URL.
# These appear in the Finder app and Projects Folder.

# Project 1
NEXT_PUBLIC_PROJECT_1_URL=https://your-project-1.vercel.app
NEXT_PUBLIC_PROJECT_1_GITHUB=https://github.com/your-username/project-1

# Project 2
NEXT_PUBLIC_PROJECT_2_URL=https://your-project-2.vercel.app
NEXT_PUBLIC_PROJECT_2_GITHUB=https://github.com/your-username/project-2

# Project 3
NEXT_PUBLIC_PROJECT_3_URL=https://your-project-3.vercel.app
NEXT_PUBLIC_PROJECT_3_GITHUB=https://github.com/your-username/project-3

# Project 4
NEXT_PUBLIC_PROJECT_4_URL=https://your-project-4.vercel.app
NEXT_PUBLIC_PROJECT_4_GITHUB=https://github.com/your-username/project-4

# ──────────────────────────────────────────────────────────
# 👤 SOCIAL & PERSONAL URLs
# ──────────────────────────────────────────────────────────
# Your GitHub profile URL (username is auto-extracted from this)
NEXT_PUBLIC_GITHUB_PROFILE=https://github.com/your-username

# Your Twitter/X profile URL
NEXT_PUBLIC_TWITTER_URL=https://x.com/your-twitter-handle

# Your LinkedIn profile URL
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-linkedin-slug/

# Your portfolio domain (primary)
NEXT_PUBLIC_PORTFOLIO_URL=https://yourdomain.com

# Your portfolio domain (alternate / Vercel deployment)
NEXT_PUBLIC_PORTFOLIO_ALT_URL=https://your-name.vercel.app/

# Your contact email address
NEXT_PUBLIC_EMAIL=your-email@gmail.com

# Your phone number (use quotes if it contains spaces or +)
NEXT_PUBLIC_PHONE="+1 000-000-0000"

# ──────────────────────────────────────────────────────────
# 🤖 AI — Groq API Key (Powers the Siri Assistant)
# ──────────────────────────────────────────────────────────
# Get your FREE API key from: https://console.groq.com/keys
# Used for: Chat completion, speech-to-text, text-to-speech
GROQ_API_KEY=gsk_your_groq_api_key_here

# ──────────────────────────────────────────────────────────
# 🎬 Apple TV App — TMDB & Video APIs (Optional)
# ──────────────────────────────────────────────────────────
# TMDB API key — Get from: https://www.themoviedb.org/settings/api
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

# ──────────────────────────────────────────────────────────
# 🖼️ Placeholder Image API (Optional)
# ──────────────────────────────────────────────────────────
NEXT_PUBLIC_PICSUM_API_URL=https://picsum.photos
```

---

## 🎭 Make It Yours

This portfolio is designed to be fully personalized through environment variables and a few config files. Follow this complete checklist to replace **everything** with your own identity:

### Step 1 — Environment Variables (`.env`)

Open your `.env` file and replace every personal value:

| Variable | What to Put | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GITHUB_PROFILE` | Your full GitHub profile URL | `https://github.com/johndoe-dev` |
| `NEXT_PUBLIC_TWITTER_URL` | Your Twitter/X profile URL | `https://x.com/johndoe` |
| `NEXT_PUBLIC_LINKEDIN_URL` | Your LinkedIn profile URL | `https://www.linkedin.com/in/johndoe/` |
| `NEXT_PUBLIC_PORTFOLIO_URL` | Your primary portfolio domain | `https://johndoe.dev` |
| `NEXT_PUBLIC_PORTFOLIO_ALT_URL` | Your Vercel/alternate portfolio URL | `https://johndoe-portfolio.vercel.app/` |
| `NEXT_PUBLIC_EMAIL` | Your contact email address | `john@gmail.com` |
| `NEXT_PUBLIC_PHONE` | Your phone number (in quotes if using + or spaces) | `"+1 555-123-4567"` |
| `NEXT_PUBLIC_PROJECT_1_URL` | Live URL of your 1st project | `https://my-app.vercel.app` |
| `NEXT_PUBLIC_PROJECT_1_GITHUB` | GitHub repo URL of your 1st project | `https://github.com/johndoe-dev/my-app` |
| `NEXT_PUBLIC_PROJECT_2_URL` | Live URL of your 2nd project | _(same pattern)_ |
| `NEXT_PUBLIC_PROJECT_2_GITHUB` | GitHub repo URL of your 2nd project | _(same pattern)_ |
| `NEXT_PUBLIC_PROJECT_3_URL` | Live URL of your 3rd project | _(same pattern)_ |
| `NEXT_PUBLIC_PROJECT_3_GITHUB` | GitHub repo URL of your 3rd project | _(same pattern)_ |
| `NEXT_PUBLIC_PROJECT_4_URL` | Live URL of your 4th project | _(same pattern)_ |
| `NEXT_PUBLIC_PROJECT_4_GITHUB` | GitHub repo URL of your 4th project | _(same pattern)_ |
| `GROQ_API_KEY` | Your Groq API key for Siri AI | Get free at [console.groq.com/keys](https://console.groq.com/keys) |
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB API key for Apple TV app | Get free at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |

> **Note:** The `GITHUB_USERNAME` is **automatically extracted** from your `NEXT_PUBLIC_GITHUB_PROFILE` URL. You do not need to set it separately.

### Step 2 — Projects Configuration

Edit **`src/constants/projects.js`** to update your project titles, descriptions, and thumbnail images:

```js
export const projects = [
  {
    id: 1,
    title: "Your Project Name",            // ← Your project title
    description: "A brief description...",  // ← Your project description
    image: "/projects/your-project.webp",   // ← Your project screenshot
    link: PROJECT_1_URL,                    // ← Pulled from .env
    github: PROJECT_1_GITHUB,              // ← Pulled from .env
  },
  // ... repeat for projects 2, 3, 4
];
```

Then add your project screenshots to **`public/projects/`** (use `.webp` format for best performance).

### Step 3 — Tech Stack

Edit **`src/constants/tech.js`** to list your own skills:

```js
export const techStack = [
  { category: "Frontend", items: ["React.js", "Next.js", "TypeScript"] },
  { category: "Styling",  items: ["Tailwind CSS", "Sass", "CSS"] },
  { category: "Backend",  items: ["Node.js", "Express", "Python"] },
  { category: "Database", items: ["MongoDB", "PostgreSQL", "Redis"] },
  { category: "Dev Tools", items: ["Git", "GitHub", "Docker", "AWS"] },
];
```

### Step 4 — Resume

Replace the resume file at:
```
public/files/resume.pdf
```
with your own PDF resume. The filename **must** remain `resume.pdf`.

### Step 5 — Gallery / Photos

Replace images in **`public/images/`** with your own photos:

| Directory | Purpose |
|-----------|---------|
| `public/images/gal1.webp` — `gal4.webp` | Library photos |
| `public/images/memories/1.webp` — `5.webp` | Memories album |
| `public/images/places/1.webp` — `4.webp` | Places album |
| `public/images/people/1.webp` — `4.webp` | People album |

Update **`src/constants/photos.js`** if you change the number of photos or categories.

### Step 6 — Favicon & Branding

Replace the favicon at:
```
public/favicon.png
public/favicon.webp
```

### Step 7 — SEO Metadata

Edit **`src/app/layout.jsx`** to update the page title and description:

```jsx
export const metadata = {
  title: "Your Name — Portfolio",
  description: "Your portfolio description here",
};
```

### Step 8 — Siri AI Context (Optional)

Edit **`src/module/siri/assistant.js`** to update the system prompt so the AI assistant knows about **you** instead of the original author. Update the prompt with your name, skills, experience, and background.

### Step 9 — Social Links

The social links in the Finder sidebar are automatically populated from your `.env` file. The configuration is in **`src/constants/socials.js`** — you only need to edit this if you want to add/remove social platforms.

### Step 10 — Locations (Weather & Maps)

Edit **`src/constants/locations.js`** to set your preferred locations for the Weather and Maps apps.

---

## 📁 Project Structure

```
MacOS-portfolio/
├── public/
│   ├── favicon.png              # App favicon
│   ├── files/
│   │   └── resume.pdf           # Your resume (PDF)
│   ├── icons/                   # App & UI icons (SVG)
│   ├── images/                  # Gallery photos, social previews
│   │   ├── memories/            # Memories album photos
│   │   ├── places/              # Places album photos
│   │   └── people/              # People album photos
│   ├── projects/                # Project screenshot thumbnails
│   ├── readme/                  # README preview screenshots
│   └── sound/                   # UI sound effects
│
├── src/
│   ├── app/
│   │   ├── layout.jsx           # Root layout (metadata, fonts, scripts)
│   │   ├── page.jsx             # Main entry — handles boot, login, responsive routing
│   │   └── api/
│   │       └── groq/            # Groq AI API routes
│   │           ├── chat/        # Chat completion endpoint
│   │           ├── speech/      # Text-to-speech endpoint
│   │           └── transcribe/  # Speech-to-text endpoint
│   │
│   ├── constants/               # All app configuration
│   │   ├── index.js             # Barrel exports
│   │   ├── env.js               # Environment variable bindings
│   │   ├── dock.js              # Dock apps configuration
│   │   ├── nav.js               # Navbar links & icons
│   │   ├── projects.js          # Portfolio projects data
│   │   ├── socials.js           # Social media links
│   │   ├── tech.js              # Tech stack categories
│   │   ├── photos.js            # Gallery photos & albums
│   │   ├── locations.js         # Predefined map/weather locations
│   │   └── window.js            # Window manager initial state
│   │
│   ├── module/
│   │   ├── desktop/             # Desktop layout
│   │   │   ├── index.jsx        # Desktop orchestrator
│   │   │   ├── apps/            # All 25+ desktop app components
│   │   │   ├── dock/            # Dock component
│   │   │   ├── home/            # Desktop home / wallpaper
│   │   │   ├── navbar/          # Top menu bar
│   │   │   ├── notch/           # Dynamic notch component
│   │   │   └── widgets/         # Desktop widgets
│   │   │
│   │   ├── mobile/              # Mobile layout
│   │   │   ├── index.jsx        # Mobile orchestrator
│   │   │   ├── apps/            # Mobile app components
│   │   │   ├── assistivetouch/  # Assistive Touch button
│   │   │   ├── controlcenter/   # iOS Control Center
│   │   │   ├── dock/            # Mobile dock
│   │   │   ├── home/            # Mobile home screen
│   │   │   ├── notch/           # Mobile notch
│   │   │   └── statusbar/       # iOS status bar
│   │   │
│   │   ├── loading/             # Boot sequence & lock screen
│   │   ├── shared/              # Shared components (GlobalAudio, etc.)
│   │   └── siri/                # Siri AI assistant logic
│   │
│   ├── store/
│   │   └── window.js            # Zustand store — windows, dock, music, settings
│   │
│   ├── styles/                  # Global CSS
│   │   ├── index.css            # Entry point (imports all below)
│   │   ├── base.css             # CSS reset & base styles
│   │   ├── apps.css             # App-specific styles
│   │   ├── dock.css             # Dock animations & layout
│   │   ├── navbar.css           # Menu bar styles
│   │   ├── notch.css            # Dynamic notch styles
│   │   ├── window.css           # Window chrome styles
│   │   ├── mobile.css           # Mobile-specific styles
│   │   ├── widgets.css          # Widget styles
│   │   ├── effects.css          # Visual effects & transitions
│   │   ├── scrollbar.css        # Custom scrollbar styles
│   │   └── launchpad.css        # Launchpad grid styles
│   │
│   └── hoc/                     # Higher-order components
│
├── .env.example                 # Environment variable template
├── .prettierrc                  # Prettier configuration
├── .prettierignore              # Prettier ignore rules
├── eslint.config.js             # ESLint flat config
├── next.config.mjs              # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── jsconfig.json                # Path aliases (@module, @store, etc.)
├── package.json                 # Dependencies & scripts
├── LICENSE                      # Custom MIT License
└── README.md                    # This file
```

---

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push your fork to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables from your `.env` file in the Vercel dashboard under **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js and handles the build

### Deploy on Other Platforms

```bash
# Build for production
npm run build

# Start the production server
npm run start
```

Compatible with any Node.js hosting: **Railway**, **Render**, **DigitalOcean App Platform**, **AWS Amplify**, **Netlify** (with SSR adapter).

> **Important:** Make sure to set all environment variables in your hosting platform's dashboard. The `GROQ_API_KEY` is a server-side variable (no `NEXT_PUBLIC_` prefix) and must be set as a server environment variable.

---

## ⚡ Performance

- **WebP Images** — All assets optimized in next-gen WebP format
- **Next.js Image Optimization** — Automatic resizing, lazy loading, and AVIF/WebP serving
- **Code Splitting** — Automatic per-route code splitting by Next.js App Router
- **Aggressive Caching** — Image cache TTL set to 30 days
- **Responsive Image Sizes** — Device-specific image sizes configured (390px → 2560px)
- **Lint-staged** — Pre-commit hooks ensure code quality on every commit

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please ensure your code passes linting (`npm run lint`) and formatting (`npm run format:check`) before submitting.

---

## 📄 License

This project is licensed under a **Custom MIT License** with additional conditions:

- ✅ **Personal & Educational Use** — Fully permitted
- ✅ **Forking** — You **must fork** the original repo (not re-upload as a new repo)
- ✅ **Attribution** — You **must credit** the original author if showcasing publicly
- ❌ **Exact Replicas** — You may **not** publish identical copies without significant modifications

See the [LICENSE](LICENSE) file for full details.

---

## 🙏 Credits & Acknowledgments

- **macOS Design** — Inspired by Apple's macOS Sequoia / Sonoma interface
- **Jamendo API** — Music streaming data
- **wttr.in** — Weather data
- **OpenStreetMap & Nominatim** — Maps and geocoding
- **TMDB** — Movie and TV show data for Apple TV app
- **Groq** — AI inference for the Siri assistant
- **GSAP** — Animation engine
- **xterm.js** — Terminal emulator

---

<p align="center">
  If you found this project helpful, consider giving it a ⭐ on GitHub!
</p>
