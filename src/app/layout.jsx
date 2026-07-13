import "../styles/index.css";

const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");
const SITE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://macos-kuldeeprajput.vercel.app",
);
const OWNER_NAME = "Kuldeep Rajput";
const SITE_NAME = `${OWNER_NAME} - macOS Portfolio`;
const SITE_DESCRIPTION =
  "An interactive macOS-inspired developer portfolio featuring functional apps, an AI-powered Siri assistant, music player, terminal, weather, maps, resume preview, and project showcases built with Next.js, React, and GSAP.";
const OG_IMAGE = "/readme/desktop.png";
const GITHUB_PROFILE =
  process.env.NEXT_PUBLIC_GITHUB_PROFILE || "https://github.com/kuldeeprajput-dev";
const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/kuldeepdotcom/";
const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/kuldeepdotcom";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "contact.kuldeeprajput@gmail.com";

const getTwitterHandle = (url) => {
  try {
    const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : undefined;
  } catch {
    return undefined;
  }
};

const sameAs = [GITHUB_PROFILE, LINKEDIN_URL, TWITTER_URL].filter(Boolean);
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#person` },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: OWNER_NAME,
    url: SITE_URL,
    email: `mailto:${EMAIL}`,
    jobTitle: "Full Stack Developer",
    sameAs,
  },
];

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  title: {
    default: SITE_NAME,
    template: `%s | ${OWNER_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    OWNER_NAME,
    "portfolio",
    "macOS portfolio",
    "iOS portfolio",
    "developer portfolio",
    "interactive portfolio",
    "Next.js portfolio",
    "React portfolio",
    "AI portfolio",
    "frontend developer",
    "full stack developer",
    "web developer",
    "software engineer portfolio",
  ],
  authors: [{ name: OWNER_NAME, url: SITE_URL }],
  creator: OWNER_NAME,
  publisher: OWNER_NAME,
  category: "technology",
  classification: "Portfolio",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1920,
        height: 1080,
        alt: `${SITE_NAME} desktop preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
    creator: getTwitterHandle(TWITTER_URL),
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://api.jamendo.com" />
        <link rel="preconnect" href="https://prod-1.storage.jamendo.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wttr.in" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const removeAttr = (el) => {
                  if (el.removeAttribute) {
                    el.removeAttribute('bis_skin_checked');
                  }
                };
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((m) => {
                    if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                      removeAttr(m.target);
                    }
                    if (m.addedNodes) {
                      m.addedNodes.forEach((n) => {
                        if (n.nodeType === 1) {
                          removeAttr(n);
                          n.querySelectorAll('[bis_skin_checked]').forEach(removeAttr);
                        }
                      });
                    }
                  });
                });
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['bis_skin_checked']
                });
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
