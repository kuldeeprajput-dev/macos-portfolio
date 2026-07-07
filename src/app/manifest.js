const OWNER_NAME = "Kuldeep Rajput";
const SITE_NAME = `${OWNER_NAME} - macOS Portfolio`;
const SITE_DESCRIPTION =
  "Interactive macOS-inspired developer portfolio with desktop apps, mobile views, projects, resume, and Siri assistant.";

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: "macOS Portfolio",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["portfolio", "developer", "productivity"],
    icons: [
      {
        src: "/macbook.png",
        sizes: "100x100",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.png",
        sizes: "444x592",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    screenshots: [
      {
        src: "/readme/desktop.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "Desktop portfolio experience",
      },
      {
        src: "/readme/mobile.png",
        sizes: "441x789",
        type: "image/png",
        form_factor: "narrow",
        label: "Mobile portfolio experience",
      },
    ],
  };
}
