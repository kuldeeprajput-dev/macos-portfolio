import { useState, useEffect } from "react";
import useWindowsStore from "@store/window";
import { DEFAULT_BOOKMARKS, WALLPAPERS, IFRAME_COMPATIBLE_SITES, MOCK_HISTORY } from "../data";
import { PROJECT_1_URL, PROJECT_2_URL, PROJECT_3_URL } from "@constants";

const isIframeable = (url) => {
  if (url.startsWith("safari://")) return true;
  const urlLower = url.toLowerCase();
  if (urlLower.includes("wikipedia.org")) return true;
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();
    const currentHost = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
    if (host === "localhost" || host === "127.0.0.1" || host === currentHost) {
      return true;
    }
  } catch {
    /* empty */
  }
  return IFRAME_COMPATIBLE_SITES.some((site) => urlLower.includes(site));
};

const useSafari = () => {
  const [tabs, setTabs] = useState([
    {
      id: "tab-1",
      title: "Start Page",
      url: "safari://start",
      history: ["safari://start"],
      historyIndex: 0,
      isReaderMode: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [addressInput, setAddressInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("bookmarks"); // bookmarks, readingList, history
  const [searchEngine, setSearchEngine] = useState("Google");
  const [showDownloads, setShowDownloads] = useState(false);
  const [showTabOverview, setShowTabOverview] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(WALLPAPERS[0].value);
  const [enabledSections, setEnabledSections] = useState({
    favorites: true,
    privacyReport: true,
    readingList: true,
    background: true,
  });
  const [bookmarks, setBookmarks] = useState(DEFAULT_BOOKMARKS);
  const [historyList, setHistoryList] = useState(MOCK_HISTORY);

  // macOS Safari Settings states
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [homepage, setHomepage] = useState("safari://start");
  const [showTabIcons, setShowTabIcons] = useState(true);
  const [preventTracking, setPreventTracking] = useState(true);
  const [blockCookies, setBlockCookies] = useState(false);
  const [enableJavaScript, setEnableJavaScript] = useState(true);
  const [developMenuEnabled, setDevelopMenuEnabled] = useState(false);

  // Custom reading settings
  const [readerFont, setReaderFont] = useState("serif"); // serif, sans
  const [readerTheme, setReaderTheme] = useState("sepia"); // white, sepia, gray, night
  const [readerFontSize, setReaderFontSize] = useState(16); // px

  const { closeWindow, openWindow, setWindowData } = useWindowsStore();
  const safariWindowData = useWindowsStore((state) => state.windows.safari?.data);
  const isOpen = useWindowsStore((state) => state.windows.safari?.isOpen);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const isBookmarked = bookmarks.some((b) => b.url === activeTab.url);

  // Reset tabs when Safari window is closed
  useEffect(() => {
    if (!isOpen) {
      setTabs([
        {
          id: "tab-1",
          title: "Start Page",
          url: "safari://start",
          history: ["safari://start"],
          historyIndex: 0,
          isReaderMode: false,
        },
      ]);
      setActiveTabId("tab-1");
      setAddressInput("");
      setShowSidebar(false);
      setShowDownloads(false);
      setShowTabOverview(false);
      setShowSettings(false);
      setShowAbout(false);
    }
  }, [isOpen]);

  // Sync addressInput with activeTab url
  useEffect(() => {
    if (activeTab) {
      if (activeTab.url === "safari://start") {
        setAddressInput("");
      } else {
        setAddressInput(activeTab.url);
      }
    }
  }, [activeTab, activeTabId]);

  // Log history
  useEffect(() => {
    if (activeTab && activeTab.url && !activeTab.url.startsWith("safari://")) {
      const title = activeTab.title || activeTab.url;
      const url = activeTab.url;
      setHistoryList((prev) => {
        if (prev.length > 0 && prev[0].url === url) return prev;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return [{ title, url, time: timeStr }, ...prev];
      });
    }
  }, [activeTab]);

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTabObj = {
      id: newId,
      title: "Start Page",
      url: "safari://start",
      history: ["safari://start"],
      historyIndex: 0,
      isReaderMode: false,
    };
    setTabs((prev) => [...prev, newTabObj]);
    setActiveTabId(newId);
    setShowTabOverview(false);
  };

  const handleCloseTab = (tabId, e) => {
    if (e) e.stopPropagation();
    if (tabs.length === 1) {
      // Just reset the single tab to start page
      setTabs([
        {
          id: "tab-1",
          title: "Start Page",
          url: "safari://start",
          history: ["safari://start"],
          historyIndex: 0,
          isReaderMode: false,
        },
      ]);
      setActiveTabId("tab-1");
      return;
    }
    const closeIndex = tabs.findIndex((t) => t.id === tabId);
    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      const nextActiveIndex = Math.max(0, closeIndex - 1);
      setActiveTabId(nextTabs[nextActiveIndex].id);
    }
  };

  const navigateTabTo = (url) => {
    let targetUrl = url.trim();
    if (!targetUrl) return;

    const lowerQuery = targetUrl.toLowerCase();
    let isRedirected = false;

    if (lowerQuery.includes("youtube")) {
      targetUrl = PROJECT_1_URL;
      isRedirected = true;
    } else if (lowerQuery.includes("insta")) {
      targetUrl = PROJECT_2_URL;
      isRedirected = true;
    } else if (lowerQuery.includes("resume")) {
      targetUrl = PROJECT_3_URL;
      isRedirected = true;
    } else if (lowerQuery.includes("portfolio")) {
      targetUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      isRedirected = true;
    } else if (lowerQuery.includes("wikipedia")) {
      targetUrl = "https://en.wikipedia.org";
      isRedirected = true;
    } else if (lowerQuery.includes("map")) {
      targetUrl = "https://openstreetmap.org";
      isRedirected = true;
    }

    if (!isRedirected && !targetUrl.startsWith("safari://")) {
      if (!/^https?:\/\//i.test(targetUrl)) {
        const isLocal =
          lowerQuery.startsWith("localhost") ||
          lowerQuery.startsWith("127.0.0.1") ||
          lowerQuery.startsWith(window.location.host.toLowerCase()) ||
          lowerQuery.startsWith(window.location.hostname.toLowerCase());

        if (isLocal) {
          let protocol = "http://";
          if (
            lowerQuery.startsWith(window.location.host.toLowerCase()) ||
            lowerQuery.startsWith(window.location.hostname.toLowerCase())
          ) {
            protocol = window.location.protocol + "//";
          }
          targetUrl = protocol + targetUrl;
        } else if (targetUrl.includes(".") && !targetUrl.includes(" ")) {
          targetUrl = "https://" + targetUrl;
        } else {
          // search query: convert to google search URL
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
        }
      }
    }

    // Intercept any URLs/searches that are not iframeable
    if (!targetUrl.startsWith("safari://") && !isIframeable(targetUrl)) {
      setSearchQuery(targetUrl);
      setShowSearchAlert(true);
      return;
    }

    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          const nextHistory = tab.history.slice(0, tab.historyIndex + 1);
          nextHistory.push(targetUrl);

          let newTitle;
          if (targetUrl === "safari://start") {
            newTitle = "Start Page";
          } else if (targetUrl === "safari://privacy-report") {
            newTitle = "Privacy Report";
          } else if (targetUrl === "safari://history") {
            newTitle = "History";
          } else if (targetUrl === "safari://bookmarks") {
            newTitle = "Bookmarks";
          } else if (targetUrl === PROJECT_1_URL) {
            newTitle = "NewTube";
          } else if (targetUrl === PROJECT_2_URL) {
            newTitle = "Insta Downloader";
          } else if (targetUrl === PROJECT_3_URL) {
            newTitle = "Resume ATS";
          } else if (targetUrl === "https://en.wikipedia.org") {
            newTitle = "Wikipedia";
          } else if (targetUrl === "https://openstreetmap.org") {
            newTitle = "OpenStreetMap";
          } else if (
            targetUrl ===
            (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
          ) {
            newTitle = "Portfolio";
          } else if (
            targetUrl.includes("google.com/search") ||
            targetUrl.includes("duckduckgo.com") ||
            targetUrl.includes("bing.com/search") ||
            targetUrl.includes("yahoo.com/search")
          ) {
            try {
              const urlObj = new URL(targetUrl);
              const qParam = urlObj.searchParams.get("q") || urlObj.searchParams.get("p");
              const engineName = urlObj.hostname.includes("google")
                ? "Google"
                : urlObj.hostname.includes("duckduckgo")
                  ? "DuckDuckGo"
                  : urlObj.hostname.includes("bing")
                    ? "Bing"
                    : urlObj.hostname.includes("yahoo")
                      ? "Yahoo"
                      : "Web";
              newTitle = qParam ? `${qParam} - ${engineName} Search` : `${engineName} Search`;
            } catch {
              newTitle = "Search";
            }
          } else {
            try {
              const hostname = new URL(targetUrl).hostname;
              newTitle = hostname.replace("www.", "");
            } catch {
              newTitle = targetUrl;
            }
          }

          return {
            ...tab,
            url: targetUrl,
            title: newTitle,
            history: nextHistory,
            historyIndex: nextHistory.length - 1,
            isReaderMode: false, // Reset reader mode on navigation
          };
        }
        return tab;
      }),
    );
  };

  // Navigate to URL or open settings passed in window data (placed after navigateTabTo is declared)
  useEffect(() => {
    if (safariWindowData) {
      if (safariWindowData.url) {
        navigateTabTo(safariWindowData.url);
      }
      if (safariWindowData.openSettings) {
        setShowSettings(true);
      }
      if (safariWindowData.openAbout) {
        setShowAbout(true);
      }
      setWindowData("safari", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safariWindowData]);

  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id === activeTabId) {
            const nextIndex = tab.historyIndex - 1;
            const nextUrl = tab.history[nextIndex];
            return {
              ...tab,
              url: nextUrl,
              historyIndex: nextIndex,
              title: getTitleForUrl(nextUrl),
              isReaderMode: false,
            };
          }
          return tab;
        }),
      );
    }
  };

  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id === activeTabId) {
            const nextIndex = tab.historyIndex + 1;
            const nextUrl = tab.history[nextIndex];
            return {
              ...tab,
              url: nextUrl,
              historyIndex: nextIndex,
              title: getTitleForUrl(nextUrl),
              isReaderMode: false,
            };
          }
          return tab;
        }),
      );
    }
  };

  const getTitleForUrl = (url) => {
    if (url === "safari://start") return "Start Page";
    if (url === "safari://privacy-report") return "Privacy Report";
    if (url === "safari://history") return "History";
    if (url === "safari://bookmarks") return "Bookmarks";
    if (url === PROJECT_1_URL) return "NewTube";
    if (url === PROJECT_2_URL) return "Insta Downloader";
    if (url === PROJECT_3_URL) return "Resume ATS";
    if (url === "https://en.wikipedia.org") return "Wikipedia";
    if (url === "https://openstreetmap.org") return "OpenStreetMap";
    if (url === (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"))
      return "Portfolio";
    if (
      url.includes("google.com/search") ||
      url.includes("duckduckgo.com") ||
      url.includes("bing.com/search") ||
      url.includes("yahoo.com/search")
    ) {
      try {
        const urlObj = new URL(url);
        const q = urlObj.searchParams.get("q") || urlObj.searchParams.get("p");
        const engineName = urlObj.hostname.includes("google")
          ? "Google"
          : urlObj.hostname.includes("duckduckgo")
            ? "DuckDuckGo"
            : urlObj.hostname.includes("bing")
              ? "Bing"
              : urlObj.hostname.includes("yahoo")
                ? "Yahoo"
                : "Web";
        return q ? `${q} - ${engineName}` : `${engineName} Search`;
      } catch {
        return "Search";
      }
    }
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Web Page";
    }
  };

  const handleReload = () => {
    // Simulated reload effect
    const prevUrl = activeTab.url;
    navigateTabTo("safari://start");
    setTimeout(() => {
      navigateTabTo(prevUrl);
    }, 100);
  };

  const toggleReaderMode = () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          return { ...tab, isReaderMode: !tab.isReaderMode };
        }
        return tab;
      }),
    );
  };

  const toggleBookmark = () => {
    if (activeTab.url === "safari://start" || activeTab.url.startsWith("safari://")) return;
    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.url !== activeTab.url));
    } else {
      setBookmarks((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: activeTab.title,
          url: activeTab.url,
          img: `https://www.google.com/s2/favicons?domain=${new URL(activeTab.url).hostname}&sz=32`,
        },
      ]);
    }
  };

  return {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    addressInput,
    setAddressInput,
    showSidebar,
    setShowSidebar,
    sidebarTab,
    setSidebarTab,
    searchEngine,
    setSearchEngine,
    showDownloads,
    setShowDownloads,
    showTabOverview,
    setShowTabOverview,
    backgroundImage,
    setBackgroundImage,
    enabledSections,
    setEnabledSections,
    bookmarks,
    setBookmarks,
    historyList,
    setHistoryList,
    readerFont,
    setReaderFont,
    readerTheme,
    setReaderTheme,
    readerFontSize,
    setReaderFontSize,
    activeTab,
    isBookmarked,
    navigateTabTo,
    handleNewTab,
    handleCloseTab,
    handleGoBack,
    handleGoForward,
    handleReload,
    toggleReaderMode,
    toggleBookmark,
    isIframeable,
    closeWindow,
    openWindow,
    showSettings,
    setShowSettings,
    showAbout,
    setShowAbout,
    showSearchAlert,
    setShowSearchAlert,
    searchQuery,
    setSearchQuery,
    homepage,
    setHomepage,
    showTabIcons,
    setShowTabIcons,
    preventTracking,
    setPreventTracking,
    blockCookies,
    setBlockCookies,
    enableJavaScript,
    setEnableJavaScript,
    developMenuEnabled,
    setDevelopMenuEnabled,
  };
};

export default useSafari;
