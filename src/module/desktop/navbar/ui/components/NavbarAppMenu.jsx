import { useState, useEffect, useRef } from "react";
import useWindowsStore from "@store/window";
import {
  GITHUB_PROFILE,
  LINKEDIN_URL,
  TWITTER_URL,
  PROJECT_3_URL,
  PROJECT_4_URL,
  EMAIL,
} from "@constants";

const NavbarAppMenu = ({ activeAppName, openWindow, isAppleMenuOpen, setIsAppleMenuOpen }) => {
  const { setAboutPortfolioOpen, setWindowData, windows } = useWindowsStore();
  const [openDropdown, setOpenDropdown] = useState(null); // 'portfolio' | 'projects' | 'contact' | 'resume' | null
  const containerRef = useRef(null);

  const getActiveApp = () => {
    let activeKey = null;
    let maxZ = -1;

    Object.entries(windows).forEach(([key, win]) => {
      if (win.isOpen && !win.isMinimized && win.zIndex > maxZ) {
        maxZ = win.zIndex;
        activeKey = key;
      }
    });

    return activeKey;
  };

  const activeAppKey = getActiveApp();

  const toggleDropdown = (name, e) => {
    e.stopPropagation();
    if (isAppleMenuOpen) {
      setIsAppleMenuOpen(false);
    }
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    if (isAppleMenuOpen) {
      setOpenDropdown(null);
    }
  }, [isAppleMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleAction = (callback) => {
    setOpenDropdown(null);
    if (callback) callback();
  };

  const dropdowns = {
    portfolio: [
      [
        {
          label: `About ${activeAppName}`,
          onClick: () => {
            if (activeAppName === "Safari") {
              openWindow("safari", { openAbout: true });
            } else if (activeAppName === "Finder") {
              openWindow("finder", { openAbout: true });
            } else if (activeAppName === "Photos") {
              if (activeAppKey === "imgfile") {
                // Merge openAbout into existing data so the photos array is preserved
                const existing = windows["imgfile"]?.data || {};
                setWindowData("imgfile", { ...existing, openAbout: true });
              } else {
                openWindow("photos", { openAbout: true });
              }
            } else if (activeAppName === "Settings") {
              openWindow("settings", { openAbout: true });
            } else if (activeAppName === "Apple TV") {
              openWindow("appletv", { openAbout: true });
            } else if (activeAppName === "Calculator") {
              openWindow("calculator", { openAbout: true });
            } else if (activeAppName === "App Store") {
              openWindow("appstore", { openAbout: true });
            } else if (activeAppName === "Calendar") {
              openWindow("calendar", { openAbout: true });
            } else if (activeAppName === "Weather") {
              openWindow("weather", { openAbout: true });
            } else if (activeAppName === "Terminal") {
              openWindow("terminal", { openAbout: true });
            } else if (activeAppName === "Contact") {
              openWindow("contact", { openAbout: true });
            } else if (activeAppName === "Notes") {
              openWindow("notes", { openAbout: true });
            } else if (activeAppName === "Messages") {
              openWindow("messages", { openAbout: true });
            } else if (activeAppName === "FaceTime") {
              openWindow("call", { openAbout: true });
            } else if (activeAppName === "VS Code") {
              openWindow("vscode", { openAbout: true });
            } else if (activeAppName === "Postman") {
              openWindow("postman", { openAbout: true });
            } else if (activeAppName === "Maps") {
              openWindow("map", { openAbout: true });
            } else if (activeAppName === "Font Book") {
              openWindow("font", { openAbout: true });
            } else if (activeAppName === "Kuldeep's Portfolio") {
              setAboutPortfolioOpen(true);
            } else {
              openWindow("settings", { tab: "General" });
            }
          },
        },
      ],
      [
        {
          label: "Preferences...",
          meta: "⌘,",
          disabled:
            activeAppName === "Calculator" ||
            activeAppName === "App Store" ||
            activeAppName === "Calendar" ||
            activeAppName === "Weather" ||
            activeAppName === "Terminal" ||
            activeAppName === "Contact" ||
            activeAppName === "Notes" ||
            activeAppName === "Messages" ||
            activeAppName === "Apple TV" ||
            activeAppName === "FaceTime" ||
            activeAppName === "VS Code" ||
            activeAppName === "Postman" ||
            activeAppName === "Maps" ||
            activeAppName === "Font Book",
          onClick: () => {
            if (activeAppName === "Safari") {
              openWindow("safari", { openSettings: true });
            } else if (activeAppName === "Finder") {
              openWindow("settings", { tab: "General", subPage: "storage" });
            } else if (activeAppName === "Photos") {
              openWindow("settings", { tab: "General", subPage: "storage" });
            } else if (activeAppName === "Settings") {
              openWindow("settings", { tab: "Apple ID" });
            } else if (activeAppName === "Kuldeep's Portfolio") {
              openWindow("settings", { tab: "General", subPage: "about" });
            } else {
              openWindow("settings");
            }
          },
        },
        {
          label: "Services",
          meta: "›",
          disabled: true,
        },
      ],
      [
        {
          label: `Hide ${activeAppName}`,
          meta: "⌘H",
          disabled: true,
        },
        {
          label: "Hide Others",
          meta: "⌥⌘H",
          disabled: true,
        },
        {
          label: "Show All",
          disabled: true,
        },
      ],
    ],
    projects: [
      [
        {
          label: "Open Projects Explorer",
          meta: "⌘F",
          onClick: () => openWindow("finder"),
        },
        {
          label: "Developer Workspace",
          meta: "⌥⌘T",
          onClick: () => openWindow("vscode"),
        },
      ],
      [
        {
          label: "View Featured Project",
          onClick: () => openWindow("safari", { url: PROJECT_4_URL }),
        },
        {
          label: "Launchpad Overview",
          meta: "⇧⌘L",
          onClick: () => openWindow("launchpad"),
        },
      ],
      [
        {
          label: "GitHub Repositories",
          onClick: () => openWindow("safari", { url: GITHUB_PROFILE }),
        },
      ],
    ],
    contact: [
      [
        {
          label: "Open Contact Window",
          meta: "⌘C",
          onClick: () => openWindow("contact"),
        },
      ],
      [
        {
          label: "Email Me Directly",
          onClick: () => {
            const mailtoLink = document.createElement("a");
            mailtoLink.href = `mailto:${EMAIL}`;
            mailtoLink.click();
          },
        },
      ],
      [
        {
          label: "Connect on LinkedIn",
          onClick: () => openWindow("safari", { url: LINKEDIN_URL }),
        },
        {
          label: "Follow on Twitter / X",
          onClick: () => openWindow("safari", { url: TWITTER_URL }),
        },
      ],
    ],
    resume: [
      [
        {
          label: "Open Resume Viewer",
          meta: "⌘R",
          onClick: () => openWindow("resume"),
        },
      ],
      [
        {
          label: "Download PDF Resume",
          onClick: () => {
            const link = document.createElement("a");
            link.href = "/files/resume.pdf";
            link.download = "Kuldeep_Rajput_Resume.pdf";
            link.click();
          },
        },
      ],
      [
        {
          label: "Interactive ATS System",
          onClick: () => openWindow("safari", { url: PROJECT_3_URL }),
        },
      ],
    ],
  };

  const renderDropdown = (name) => {
    if (openDropdown !== name) return null;
    const sections = dropdowns[name];

    return (
      <div className="mac-dropdown" role="menu">
        {sections.map((section, sectionIndex) => (
          <div className="apple-menu-section" key={sectionIndex}>
            {section.map((item) => (
              <button
                type="button"
                className="apple-menu-item"
                disabled={item.disabled}
                key={item.label}
                onClick={() => handleAction(item.onClick)}
                role="menuitem"
              >
                <span>{item.label}</span>
                {item.meta && <span className="apple-menu-meta">{item.meta}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <ul className="nav-links max-sm:hidden" ref={containerRef}>
      <li
        className={`font-bold min-w-[80px] shrink-0 relative rounded select-none ${
          openDropdown === "portfolio" ? "bg-white/15" : "hover:bg-white/10"
        }`}
        onClick={(e) => toggleDropdown("portfolio", e)}
      >
        {activeAppName}
        {renderDropdown("portfolio")}
      </li>
      <li
        className={`relative rounded select-none ${
          openDropdown === "projects" ? "bg-white/15" : "hover:bg-white/10"
        }`}
        onClick={(e) => toggleDropdown("projects", e)}
      >
        Projects
        {renderDropdown("projects")}
      </li>
      <li
        className={`relative rounded select-none ${
          openDropdown === "contact" ? "bg-white/15" : "hover:bg-white/10"
        }`}
        onClick={(e) => toggleDropdown("contact", e)}
      >
        Contact
        {renderDropdown("contact")}
      </li>
      <li
        className={`relative rounded select-none ${
          openDropdown === "resume" ? "bg-white/15" : "hover:bg-white/10"
        }`}
        onClick={(e) => toggleDropdown("resume", e)}
      >
        Resume
        {renderDropdown("resume")}
      </li>
    </ul>
  );
};

export default NavbarAppMenu;
