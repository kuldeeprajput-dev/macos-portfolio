import { useCallback, useState, useEffect } from "react";
import useWindowsStore from "@store/window";
import { getMobileBookmarks, DEFAULT_TABS } from "../data";
import {
  PROJECT_1_URL,
  PROJECT_2_URL,
  PROJECT_3_URL,
  PROJECT_4_URL,
  PORTFOLIO_ALT_URL,
} from "@constants";

export default function useSafari() {
  const { closeWindow, setWindowData } = useWindowsStore();
  const safariWindowData = useWindowsStore((state) => state.windows.safari?.data);

  const mobileBookmarks = getMobileBookmarks();

  const [tabs, setTabs] = useState(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [showTabsOverview, setShowTabsOverview] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [toastMessage, setToastMessage] = useState("");
  const [iframeLoading, setIframeLoading] = useState(true);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const currentUrl = activeTab.url;
  const history = activeTab.history;
  const historyIndex = activeTab.historyIndex;

  useEffect(() => {
    setIframeLoading(true);
  }, [currentUrl]);

  useEffect(() => {
    setInputValue(currentUrl === "safari://start" ? "" : currentUrl);
  }, [activeTabId, currentUrl]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const navigateTo = (url) => {
    let targetUrl = url.trim();
    if (!targetUrl) return;

    const lowerQuery = targetUrl.toLowerCase();
    let isRedirected = false;

    if (lowerQuery.includes("youtube") || lowerQuery.includes("newtube")) {
      targetUrl = PROJECT_1_URL;
      isRedirected = true;
    } else if (lowerQuery.includes("insta") || lowerQuery.includes("snsta")) {
      targetUrl = PROJECT_2_URL;
      isRedirected = true;
    } else if (lowerQuery.includes("resume")) {
      targetUrl = PROJECT_3_URL;
      isRedirected = true;
    } else if (lowerQuery.includes("docs-editor") || lowerQuery.includes("docs")) {
      targetUrl = PROJECT_4_URL;
      isRedirected = true;
    } else if (lowerQuery.includes("portfolio")) {
      targetUrl = PORTFOLIO_ALT_URL;
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
        if (targetUrl.includes(".") && !targetUrl.includes(" ")) {
          targetUrl = "https://" + targetUrl;
        } else {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
        }
      }
    }

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          const newHistory = t.history.slice(0, t.historyIndex + 1);
          newHistory.push(targetUrl);
          return {
            ...t,
            url: targetUrl,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }
        return t;
      }),
    );
  };

  useEffect(() => {
    if (!safariWindowData) return;
    if (safariWindowData.url) {
      navigateTo(safariWindowData.url);
    }
    setWindowData("safari", null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safariWindowData, setWindowData]);

  const handleBack = useCallback(() => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === activeTabId) {
            return {
              ...t,
              url: t.history[idx],
              historyIndex: idx,
            };
          }
          return t;
        }),
      );
    }
  }, [activeTabId, historyIndex]);

  const handleForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === activeTabId) {
            return {
              ...t,
              url: t.history[idx],
              historyIndex: idx,
            };
          }
          return t;
        }),
      );
    }
  }, [activeTabId, history.length, historyIndex]);

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app !== "safari") return;

      if (showTabsOverview) {
        e.preventDefault();
        setShowTabsOverview(false);
        return;
      }
      if (showShareSheet) {
        e.preventDefault();
        setShowShareSheet(false);
        return;
      }
      if (showFormatMenu) {
        e.preventDefault();
        setShowFormatMenu(false);
        return;
      }
      if (historyIndex > 0) {
        e.preventDefault();
        handleBack();
      }
    };

    const handleNavForward = (e) => {
      if (e.detail?.app !== "safari") return;

      if (historyIndex < history.length - 1) {
        e.preventDefault();
        handleForward();
      }
    };

    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [
    handleBack,
    handleForward,
    history.length,
    historyIndex,
    showFormatMenu,
    showShareSheet,
    showTabsOverview,
  ]);

  const handleSearchSubmit = (val) => {
    if (!val.trim()) return;
    let target = val.trim();
    if (!/^https?:\/\//i.test(target) && target.includes(".")) {
      target = "https://" + target;
    } else if (!/^https?:\/\//i.test(target)) {
      target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
    }
    navigateTo(target);
  };

  const getCleanDomain = (url) => {
    if (url === "safari://start") return "Start Page";
    if (url === "safari://privacy-report") return "Privacy Report";
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const isIframeable = (url) => {
    if (url.startsWith("safari://")) return true;
    const urlLower = url.toLowerCase();
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.toLowerCase();
      const currentHost = window.location.hostname.toLowerCase();
      if (host === "localhost" || host === "127.0.0.1" || host === currentHost) {
        return true;
      }
    } catch {
      /* empty */
    }
    const getDomain = (urlStr) => {
      if (!urlStr) return "";
      try {
        const parsed = new URL(urlStr);
        return parsed.hostname;
      } catch {
        return "";
      }
    };
    const compatible = [
      "openstreetmap.org",
      "wttr.in",
      "example.com",
      "example.org",
      "map",
      getDomain(PROJECT_1_URL),
      getDomain(PROJECT_2_URL),
      getDomain(PROJECT_3_URL),
      getDomain(PROJECT_4_URL),
      "wikipedia.org",
      getDomain(PORTFOLIO_ALT_URL),
    ].filter(Boolean);
    return compatible.some((site) => urlLower.includes(site));
  };

  const handleNewTab = () => {
    const newId = Date.now();
    setTabs((prev) => [
      ...prev,
      {
        id: newId,
        url: "safari://start",
        history: ["safari://start"],
        historyIndex: 0,
      },
    ]);
    setActiveTabId(newId);
    setShowTabsOverview(false);
  };

  const handleCloseTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      setTabs([
        {
          id: 1,
          url: "safari://start",
          history: ["safari://start"],
          historyIndex: 0,
        },
      ]);
      setActiveTabId(1);
      return;
    }
    const filtered = tabs.filter((t) => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    triggerToast("Copied Link to Clipboard");
    setShowShareSheet(false);
  };

  const handleAddBookmark = () => {
    triggerToast("Added to Bookmarks");
    setShowShareSheet(false);
  };

  return {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    inputValue,
    setInputValue,
    showTabsOverview,
    setShowTabsOverview,
    showShareSheet,
    setShowShareSheet,
    showFormatMenu,
    setShowFormatMenu,
    textSize,
    setTextSize,
    toastMessage,
    setToastMessage,
    iframeLoading,
    setIframeLoading,
    activeTab,
    currentUrl,
    history,
    historyIndex,
    triggerToast,
    navigateTo,
    handleBack,
    handleForward,
    handleSearchSubmit,
    getCleanDomain,
    isIframeable,
    handleNewTab,
    handleCloseTab,
    handleCopyLink,
    handleAddBookmark,
    mobileBookmarks,
    closeWindow,
  };
}
