import {
  dockApps,
  locations,
  projects,
  socials,
  PROJECT_1_URL,
  PROJECT_2_URL,
  PROJECT_3_URL,
  PROJECT_4_URL,
  GITHUB_PROFILE,
  LINKEDIN_URL,
  TWITTER_URL,
  PORTFOLIO_URL,
} from "@constants";

const OWNER_NAME = "Kuldeep Rajput";

const FALLBACK_PROJECT_LINKS = {
  newtube: PROJECT_1_URL,
  insta: PROJECT_2_URL,
  resume: PROJECT_3_URL,
  docs: PROJECT_4_URL,
};

const FALLBACK_SOCIAL_LINKS = {
  github: GITHUB_PROFILE,
  linkedin: LINKEDIN_URL,
  twitter: TWITTER_URL,
  portfolio: PORTFOLIO_URL,
};

const PROJECT_META = {
  1: {
    key: "newtube",
    aliases: ["newtube", "new tube", "youtube clone", "video streaming", "video app"],
  },
  2: {
    key: "insta",
    aliases: [
      "snsta",
      "insta things download",
      "instagram downloader",
      "insta downloader",
      "reels downloader",
      "free course finder",
      "course finder",
    ],
  },
  3: {
    key: "resume",
    aliases: [
      "resume ats",
      "resume ats scanner",
      "resume scanner",
      "ats scanner",
      "resume analyzer",
    ],
  },
  4: {
    key: "docs",
    aliases: [
      "docs editor",
      "document editor",
      "collaborative editor",
      "real time editor",
      "documents editor",
    ],
  },
};

const APP_ALIASES = {
  finder: ["finder", "files", "file manager", "portfolio", "project folder", "projects folder"],
  launchpad: ["launchpad", "app launcher", "apps"],
  safari: ["safari", "browser", "internet", "web"],
  chrome: ["chrome", "google chrome"],
  photos: ["photos", "gallery", "pictures", "images"],
  contact: ["contact", "contacts", "email", "phone"],
  terminal: ["terminal", "shell", "bash", "skills terminal"],
  settings: ["settings", "system settings", "preferences", "system preferences"],
  calculator: ["calculator", "calc"],
  notes: ["notes", "note"],
  call: ["facetime", "call", "phone call"],
  messages: ["messages", "message", "imessage"],
  appletv: ["apple tv", "tv", "movies"],
  appstore: ["app store", "appstore"],
  calendar: ["calendar", "schedule"],
  weather: ["weather", "forecast"],
  vscode: ["vs code", "vscode", "code", "editor", "visual studio code"],
  postman: ["postman", "api client", "api"],
  map: ["map", "maps", "location"],
  font: ["font book", "fonts", "font"],
  telegram: ["telegram", "chat"],
  music: ["music", "jamendo", "song", "songs", "player"],
};

const OPEN_INTENTS = ["open", "launch", "show", "view", "start", "go to", "visit", "pull up"];
const CLOSE_INTENTS = ["close", "quit", "exit", "dismiss"];
const MINIMIZE_INTENTS = ["minimize", "hide"];
const MAXIMIZE_INTENTS = ["maximize", "fullscreen", "full screen", "make bigger"];
const RESTORE_INTENTS = ["restore", "unminimize", "bring back"];
const FOCUS_INTENTS = ["focus", "bring", "front", "switch to"];

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9%.\s:/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsTerm = (query, term) => {
  const phrase = normalizeText(term);
  if (!phrase) return false;

  if (!phrase.includes(" ") && phrase.length <= 4) {
    return new RegExp(`(^|\\s)${escapeRegex(phrase)}(\\s|$)`).test(query);
  }

  return query.includes(phrase);
};

const hasAny = (query, phrases) => phrases.some((phrase) => containsTerm(query, phrase));

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const getPercentValue = (query) => {
  const match = query.match(/(\d{1,3})\s*(?:percent|%)?/);
  if (!match) return null;
  return clamp(Number(match[1]));
};

const makeResult = (response, options = {}) => ({
  response,
  listenAfter: Boolean(options.listenAfter),
});

const getProjectFolders = () => locations.work?.children ?? [];

const getProjectRecords = () =>
  projects.map((project) => {
    const meta = PROJECT_META[project.id] ?? { key: String(project.id), aliases: [] };
    const aliases = [project.title, ...meta.aliases];
    const folder = getProjectFolders().find((item) =>
      aliases.some((alias) => containsTerm(normalizeText(item.name), alias)),
    );
    const textFile = folder?.children?.find((item) => item.fileType === "txt");
    const imageFile = folder?.children?.find((item) => item.fileType === "img");
    const urlFile = folder?.children?.find((item) => item.fileType === "url");
    const githubFile = folder?.children?.find((item) => item.fileType === "fig");

    return {
      ...project,
      key: meta.key,
      aliases,
      folder,
      textFile,
      imageFile,
      link: project.link || urlFile?.href || FALLBACK_PROJECT_LINKS[meta.key],
      github: project.github || githubFile?.href || FALLBACK_SOCIAL_LINKS.github,
      description:
        textFile?.description?.join(" ") ||
        project.description ||
        "A featured project in this portfolio.",
    };
  });

const getProjectByQuery = (query) =>
  getProjectRecords().find((project) =>
    project.aliases.some((alias) => containsTerm(query, alias)),
  );

const getProjectSummary = (project) => {
  const firstSentence = project.description.split(/(?<=[.!?])\s+/)[0] || project.description;
  return `${project.title}: ${firstSentence}`;
};

const openWindowSafely = (actions, id, data) => {
  const targetId = id === "chrome" ? "safari" : id;
  actions.openWindow?.(targetId, data);
  return targetId;
};

const openUrl = (actions, url) => {
  if (!url) return false;
  actions.openWindow?.("safari", { url });
  return true;
};

const openFinderLocation = (actions, location) => {
  if (location) actions.setActiveLocation?.(location);
  actions.openWindow?.("finder");
};

const findProjectFile = (project, type) =>
  project.folder?.children?.find((item) => item.fileType === type);

const getAppTargets = () =>
  dockApps
    .filter((app) => app.canOpen !== false)
    .map((app) => ({
      id: app.id === "folder" ? "finder" : app.id,
      name: app.name,
      aliases: [app.name, app.id, ...(APP_ALIASES[app.id] ?? [])],
    }))
    .concat([{ id: "chrome", name: "Google Chrome", aliases: APP_ALIASES.chrome }]);

const getAppByQuery = (query) =>
  getAppTargets().find((app) => app.aliases.some((alias) => containsTerm(query, alias)));

const getSocialByQuery = (query) => {
  if (containsTerm(query, "github")) {
    return {
      name: "GitHub",
      url:
        socials.find((item) => item.text.toLowerCase().includes("github"))?.link ||
        FALLBACK_SOCIAL_LINKS.github,
    };
  }
  if (containsTerm(query, "linkedin")) {
    return {
      name: "LinkedIn",
      url:
        socials.find((item) => item.text.toLowerCase().includes("linkedin"))?.link ||
        FALLBACK_SOCIAL_LINKS.linkedin,
    };
  }
  if (containsTerm(query, "twitter") || containsTerm(query, "x")) {
    return {
      name: "Twitter/X",
      url:
        socials.find((item) => item.text.toLowerCase().includes("twitter"))?.link ||
        FALLBACK_SOCIAL_LINKS.twitter,
    };
  }
  if (containsTerm(query, "portfolio website") || containsTerm(query, "website")) {
    return {
      name: "portfolio website",
      url:
        socials.find((item) => item.text.toLowerCase().includes("portfolio"))?.link ||
        FALLBACK_SOCIAL_LINKS.portfolio,
    };
  }
  return null;
};

const getOnOffIntent = (query) => {
  const wantsOff = hasAny(query, ["turn off", "switch off", "disable", "deactivate", "off"]);
  const wantsOn = hasAny(query, ["turn on", "switch on", "enable", "activate", "on"]);
  if (wantsOff) return false;
  if (wantsOn) return true;
  return null;
};

const handleMusicCommand = (query, actions) => {
  if (hasAny(query, ["next song", "next track", "skip song", "skip track"])) {
    window.dispatchEvent(new CustomEvent("macos-portfolio-next-track"));
    return makeResult("Skipping to the next track.");
  }

  if (hasAny(query, ["previous song", "previous track", "last song", "back song"])) {
    window.dispatchEvent(new CustomEvent("macos-portfolio-prev-track"));
    return makeResult("Going back to the previous track.");
  }

  if (hasAny(query, ["unmute", "sound on"])) {
    actions.setMusicState?.({ isMuted: false });
    return makeResult("Sound is back on.");
  }

  if (hasAny(query, ["mute", "sound off"])) {
    actions.setMusicState?.({ isMuted: true });
    return makeResult("Muted.");
  }

  if (hasAny(query, ["volume", "sound"])) {
    const currentVolume = actions.music?.isMuted ? 0 : (actions.music?.volume ?? 72);
    let nextVolume = getPercentValue(query);

    if (nextVolume === null && hasAny(query, ["increase", "up", "louder", "raise"])) {
      nextVolume = clamp(currentVolume + 10);
    }
    if (nextVolume === null && hasAny(query, ["decrease", "down", "lower", "quieter"])) {
      nextVolume = clamp(currentVolume - 10);
    }

    if (nextVolume !== null) {
      actions.setMusicState?.({ volume: nextVolume, isMuted: nextVolume === 0 });
      actions.updateSystemSetting?.("soundLevel", nextVolume);
      return makeResult(`Volume set to ${nextVolume} percent.`);
    }
  }

  if (hasAny(query, ["play music", "resume music", "play song", "resume song"])) {
    actions.setMusicState?.({ isPlaying: true });
    return makeResult("Playing music.");
  }

  if (hasAny(query, ["pause music", "stop music", "pause song", "stop song"])) {
    actions.setMusicState?.({ isPlaying: false });
    return makeResult("Pausing playback.");
  }

  return null;
};

const handleSettingsCommand = (query, actions) => {
  const setSetting = (key, value, response) => {
    actions.updateSystemSetting?.(key, value);
    return makeResult(response);
  };

  const switchIntent = getOnOffIntent(query);
  const hasSwitchIntent =
    switchIntent !== null || containsTerm(query, "toggle") || containsTerm(query, "switch");

  if (containsTerm(query, "brightness")) {
    const currentBrightness = actions.systemSettings?.brightness ?? 100;
    let nextBrightness = getPercentValue(query);

    if (nextBrightness === null && hasAny(query, ["increase", "up", "brighter", "raise"])) {
      nextBrightness = clamp(currentBrightness + 10);
    }
    if (nextBrightness === null && hasAny(query, ["decrease", "down", "lower", "dim"])) {
      nextBrightness = clamp(currentBrightness - 10);
    }

    if (nextBrightness !== null) {
      return setSetting(
        "brightness",
        nextBrightness,
        `Brightness set to ${nextBrightness} percent.`,
      );
    }
  }

  if (hasSwitchIntent && (containsTerm(query, "wifi") || containsTerm(query, "wi fi"))) {
    const next = switchIntent ?? !actions.systemSettings?.wifi;
    actions.updateSystemSetting?.("wifi", next);
    actions.updateSystemSetting?.("activeWifiNetwork", next ? "Home Network" : "");
    return makeResult(`Wi-Fi turned ${next ? "on" : "off"}.`);
  }

  if (hasSwitchIntent && containsTerm(query, "bluetooth")) {
    const next = switchIntent ?? !actions.systemSettings?.bluetooth;
    return setSetting("bluetooth", next, `Bluetooth turned ${next ? "on" : "off"}.`);
  }

  if (containsTerm(query, "dark mode") || containsTerm(query, "dark theme")) {
    const next = containsTerm(query, "toggle")
      ? !actions.systemSettings?.darkMode
      : (switchIntent ?? true);
    return setSetting("darkMode", next, `Dark mode turned ${next ? "on" : "off"}.`);
  }

  if (containsTerm(query, "light mode") || containsTerm(query, "light theme")) {
    return setSetting("darkMode", false, "Light mode is on.");
  }

  if (hasSwitchIntent && (containsTerm(query, "focus") || containsTerm(query, "do not disturb"))) {
    const next = switchIntent ?? !actions.systemSettings?.focusMode;
    return setSetting("focusMode", next, `Focus mode turned ${next ? "on" : "off"}.`);
  }

  if (hasSwitchIntent && containsTerm(query, "night light")) {
    const next = switchIntent ?? !actions.systemSettings?.nightLight;
    return setSetting("nightLight", next, `Night Light turned ${next ? "on" : "off"}.`);
  }

  if (hasSwitchIntent && containsTerm(query, "firewall")) {
    const next = switchIntent ?? !actions.systemSettings?.firewall;
    return setSetting("firewall", next, `Firewall turned ${next ? "on" : "off"}.`);
  }

  if (hasSwitchIntent && containsTerm(query, "battery percentage")) {
    const next = switchIntent ?? !actions.systemSettings?.showBatteryPercentage;
    return setSetting(
      "showBatteryPercentage",
      next,
      `Battery percentage is ${next ? "visible" : "hidden"}.`,
    );
  }

  if (hasSwitchIntent && containsTerm(query, "low power")) {
    const next = switchIntent ?? actions.systemSettings?.lowPowerMode !== "Always";
    return setSetting(
      "lowPowerMode",
      next ? "Always" : "Never",
      `Low Power Mode turned ${next ? "on" : "off"}.`,
    );
  }

  return null;
};

const handleProjectCommand = (query, actions) => {
  const project = getProjectByQuery(query);

  if (!project) {
    if (
      hasAny(query, [
        "show projects",
        "open projects",
        "view projects",
        "my projects",
        "project folder",
        "projects folder",
        "work folder",
      ])
    ) {
      openFinderLocation(actions, locations.work);
      return makeResult("Opening the Projects folder in Finder.");
    }

    if (hasAny(query, ["list projects", "what projects", "which projects", "all projects"])) {
      const names = getProjectRecords()
        .map((item) => item.title)
        .join(", ");
      return makeResult(`The featured projects are ${names}.`, { listenAfter: true });
    }

    return null;
  }

  if (hasAny(query, ["github", "repo", "repository", "source code", "codebase"])) {
    openUrl(actions, project.github);
    return makeResult(`Opening the GitHub repository for ${project.title}.`);
  }

  if (hasAny(query, ["folder", "files", "finder"])) {
    openFinderLocation(actions, project.folder ?? locations.work);
    return makeResult(`Opening the ${project.title} project folder.`);
  }

  if (hasAny(query, ["screenshot", "image", "preview", "picture", "photo"])) {
    const imageFile = findProjectFile(project, "img");
    if (imageFile) {
      actions.openWindow?.("imgfile", imageFile);
      return makeResult(`Opening the ${project.title} preview image.`);
    }
  }

  if (hasAny(query, ["details", "brief", "read", "text file", "project file"])) {
    const textFile = findProjectFile(project, "txt");
    if (textFile) {
      actions.openWindow?.("txtfile", textFile);
      return makeResult(`Opening the ${project.title} project brief.`);
    }
  }

  if (hasAny(query, ["tell me", "explain", "what is", "about", "describe"])) {
    return makeResult(getProjectSummary(project), { listenAfter: true });
  }

  if (hasAny(query, [...OPEN_INTENTS, "live", "demo", "website", "site", "app"])) {
    openUrl(actions, project.link);
    return makeResult(`Opening ${project.title} in Safari.`);
  }

  return makeResult(getProjectSummary(project), { listenAfter: true });
};

const handleLocationCommand = (query, actions) => {
  if (hasAny(query, ["about portfolio", "portfolio info", "about this portfolio"])) {
    return makeResult(
      "This is a simulated macOS desktop environment built with React and Next.js. It features interactive windows, widgets, a terminal, dynamic apps, and Siri voice integration to showcase my developer portfolio.",
      { listenAfter: true },
    );
  }

  // Queries asking about the user ("me")
  if (
    hasAny(query, [
      "tell me about me",
      "tell about me",
      "tell aboue me",
      "about me",
      "say about me",
      "who am i",
    ]) &&
    !hasAny(query, OPEN_INTENTS)
  ) {
    return makeResult("I am designed only responsive about Kuldeep Rajput.", { listenAfter: true });
  }

  // Informational queries about Kuldeep
  if (
    hasAny(query, [
      "tell me about kuldeep",
      "tell me about rajput",
      "tell me about kuldeep rajput",
      "who is kuldeep",
      "who is rajput",
      "who is kuldeep rajput",
      "say about kuldeep",
      "say about rajput",
      "say about kuldeep rajput",
    ]) ||
    query === "kuldeep" ||
    query === "rajput" ||
    query === "kuldeep rajput" ||
    ((containsTerm(query, "kuldeep") || containsTerm(query, "rajput")) &&
      !hasAny(query, OPEN_INTENTS))
  ) {
    return makeResult(
      `${OWNER_NAME} is a web developer focused on React, Next.js, and polished interactive portfolio experiences.`,
      { listenAfter: true },
    );
  }

  // Open queries for the About Me section
  if (
    query === "about" ||
    hasAny(query, [
      "open about me",
      "open about",
      "about me",
      "about kuldeep",
      "about rajput",
      "about kuldeep rajput",
      "developer profile",
    ])
  ) {
    openFinderLocation(actions, locations.about);
    return makeResult("Opening the About Me folder.");
  }

  if (hasAny(query, ["resume folder", "cv folder"])) {
    openFinderLocation(actions, locations.resume);
    return makeResult("Opening the Resume folder.");
  }

  if (hasAny(query, ["trash", "archive"])) {
    openFinderLocation(actions, locations.trash);
    return makeResult("Opening Archive.");
  }

  return null;
};

const handleWindowCommand = (query, actions) => {
  if (hasAny(query, ["close all windows", "quit all apps", "clear desktop"])) {
    actions.closeAllWindows?.();
    return makeResult("Closing all open windows.");
  }

  const app = getAppByQuery(query);
  if (!app) return null;

  if (hasAny(query, CLOSE_INTENTS)) {
    actions.closeWindow?.(app.id);
    return makeResult(`Closing ${app.name}.`);
  }

  if (hasAny(query, MINIMIZE_INTENTS)) {
    actions.minimizeWindow?.(app.id);
    return makeResult(`Minimizing ${app.name}.`);
  }

  if (hasAny(query, RESTORE_INTENTS)) {
    actions.unminimizeWindow?.(app.id);
    return makeResult(`Restoring ${app.name}.`);
  }

  if (hasAny(query, MAXIMIZE_INTENTS)) {
    actions.toggleMaximize?.(app.id);
    return makeResult(`Toggling fullscreen for ${app.name}.`);
  }

  if (hasAny(query, FOCUS_INTENTS)) {
    actions.focusWindow?.(app.id);
    return makeResult(`Bringing ${app.name} to the front.`);
  }

  if (hasAny(query, OPEN_INTENTS)) {
    const openedId = openWindowSafely(actions, app.id);
    if (app.id === "chrome" && openedId === "safari") {
      return makeResult("Google Chrome is not available, so I opened Safari instead.");
    }
    return makeResult(`Opening ${app.name}.`);
  }

  return null;
};

const handleSocialCommand = (query, actions) => {
  const social = getSocialByQuery(query);
  if (!social || !hasAny(query, OPEN_INTENTS)) return null;
  openUrl(actions, social.url);
  return makeResult(`Opening ${social.name} in Safari.`);
};

const handleUtilityQuestion = (query) => {
  if (hasAny(query, ["what can you do", "help me", "siri help", "commands"])) {
    return makeResult(
      "I can open apps, show project folders, launch live demos, open GitHub or LinkedIn, control music, adjust system settings, manage windows, and answer questions about this portfolio.",
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["who are you", "what are you"])) {
    return makeResult(
      `I am Siri inside ${OWNER_NAME}'s macOS Portfolio. I can navigate the portfolio, open apps, and answer project questions.`,
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["what time is it", "current time", "tell me the time"])) {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return makeResult(`It is ${time}.`, { listenAfter: true });
  }

  if (hasAny(query, ["what date is it", "current date", "today's date", "todays date"])) {
    const date = new Date().toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return makeResult(`Today is ${date}.`, { listenAfter: true });
  }

  return null;
};

const handleWebCommand = (query, rawText, actions) => {
  const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);
  if (urlMatch && hasAny(query, OPEN_INTENTS)) {
    openUrl(actions, urlMatch[0]);
    return makeResult("Opening that link in Safari.");
  }

  if (hasAny(query, ["search for", "google", "look up"])) {
    const searchText = normalizeText(rawText)
      .replace(/^(search for|google|look up)\s+/, "")
      .trim();
    if (searchText) {
      openUrl(actions, `https://www.google.com/search?q=${encodeURIComponent(searchText)}`);
      return makeResult(`Searching the web for ${searchText}.`);
    }
  }

  return null;
};

export const executeSiriCommand = (text, actions = {}) => {
  const query = normalizeText(text);
  if (!query) return null;

  if (hasAny(query, ["close siri", "bye siri", "goodbye siri", "dismiss siri"])) {
    setTimeout(() => actions.setSiriOpen?.(false), 900);
    return makeResult("Goodbye.");
  }

  return (
    handleUtilityQuestion(query) ||
    handleMusicCommand(query, actions) ||
    handleSettingsCommand(query, actions) ||
    handleProjectCommand(query, actions) ||
    handleLocationCommand(query, actions) ||
    handleSocialCommand(query, actions) ||
    handleWindowCommand(query, actions) ||
    handleWebCommand(query, text, actions)
  );
};

export const getSiriSystemPrompt = () => {
  const projectDetails = getProjectRecords()
    .map((project) => `- ${project.title}: ${project.description}`)
    .join("\n");
  const appNames = getAppTargets()
    .map((app) => app.name)
    .filter((name, index, list) => list.indexOf(name) === index)
    .join(", ");

  return `You are Siri inside ${OWNER_NAME}'s macOS and iOS portfolio simulator. Respond strictly in English, keep answers conversational and concise, and stay under three sentences unless the user asks for detail.

Portfolio context:
${projectDetails}

Available local apps and actions include: ${appNames}. The UI can open and close apps, open project folders, launch live project links, open GitHub/LinkedIn/Twitter, control music playback, adjust Wi-Fi/Bluetooth/dark mode/focus/night light/brightness/volume, and answer portfolio questions. If the user asks for an action that was not already handled, explain what you can do in this simulator instead of pretending to access the real operating system.`;
};
