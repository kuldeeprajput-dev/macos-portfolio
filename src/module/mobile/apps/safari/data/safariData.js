import { DEFAULT_BOOKMARKS } from "@module/desktop/apps/safari/data/bookmarks";
import { PORTFOLIO_ALT_URL } from "@constants";

export const getMobileBookmarks = () => {
  return DEFAULT_BOOKMARKS.map((fav) => {
    if (fav.title.toLowerCase().includes("portfolio")) {
      return { ...fav, url: PORTFOLIO_ALT_URL };
    }
    return fav;
  });
};

export const DEFAULT_TABS = [
  {
    id: 1,
    url: "safari://start",
    history: ["safari://start"],
    historyIndex: 0,
  },
];
