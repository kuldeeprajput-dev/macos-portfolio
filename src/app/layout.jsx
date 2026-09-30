import "../styles/index.css";
import { EMAIL, GITHUB_PROFILE, LINKEDIN_URL, TWITTER_URL } from "@constants/env";
import { OWNER_NAME, SITE_DESCRIPTION, SITE_NAME, pageMetadata } from "../lib/seo";
import { absoluteSiteUrl, isPreviewDeployment, siteUrl } from "../lib/site-url";

const sameAs = [GITHUB_PROFILE, LINKEDIN_URL, TWITTER_URL].filter(Boolean);
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteSiteUrl("/#website"),
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    author: { "@id": absoluteSiteUrl("/#person") },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteSiteUrl("/#person"),
    name: OWNER_NAME,
    url: siteUrl,
    email: `mailto:${EMAIL}`,
    jobTitle: "Full Stack Developer",
    sameAs,
  },
];

export const metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({}),
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  title: {
    default: SITE_NAME,
    template: `%s | ${OWNER_NAME}`,
  },
  authors: [{ name: OWNER_NAME, url: siteUrl }],
  creator: OWNER_NAME,
  publisher: OWNER_NAME,
  category: "technology",
  classification: "Portfolio",
  manifest: "/manifest.webmanifest",
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
    index: !isPreviewDeployment,
    follow: !isPreviewDeployment,
    googleBot: {
      index: !isPreviewDeployment,
      follow: !isPreviewDeployment,
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
