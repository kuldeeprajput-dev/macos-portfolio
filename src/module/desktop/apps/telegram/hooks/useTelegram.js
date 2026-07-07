import { useState, useEffect, useRef } from "react";
import { INITIAL_CHATS } from "../data/telegramData";

const useTelegram = () => {
  const [chats, setChats] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("macos_portfolio_telegram");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((savedChat) => {
            const initialChat = INITIAL_CHATS.find((c) => c.id === savedChat.id);
            if (initialChat) {
              return {
                ...initialChat,
                messages: savedChat.messages,
                status: savedChat.status || initialChat.status,
              };
            }
            return savedChat;
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState("bot");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerSection, setDrawerSection] = useState("settings");

  const [userProfile, setUserProfile] = useState({
    name: "Kuldeep Rajput",
    username: "@kuldeeprajput_dev",
    bio: "Full Stack Engineer | React, Next.js, Node.js & TypeScript enthusiast.",
    phone: "+91 ••••• •••••",
  });

  const [newGroupName, setNewGroupName] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelBio, setNewChannelBio] = useState("");
  const [chatThemeColor, setChatThemeColor] = useState("blue");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("macos_portfolio_telegram", JSON.stringify(chats));
    }
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentNode;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [activeChat?.messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessageText = inputText;
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsgObj = {
      id: Date.now(),
      text: userMessageText,
      sender: "me",
      time: timeString,
      status: "sent",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [...c.messages, userMsgObj] } : c,
      ),
    );
    setInputText("");

    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === userMsgObj.id ? { ...m, status: "read" } : m,
                ),
              }
            : c,
        ),
      );
    }, 800);

    if (activeChat.id === "bot") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        let reply = "I'm not sure how to process that command. Type `/help` to see what I can do!";
        const cmd = userMessageText.toLowerCase().trim();

        if (cmd.includes("/start")) {
          reply =
            "Hello! I am your Telegram assistant. Type `/projects`, `/skills`, or `/contact` to browse Kuldeep's portfolio.";
        } else if (cmd.includes("/project")) {
          reply =
            "Here are some top projects:\n1. **NewTube**: Video platform built with Next.js, Mux & PostgreSQL.\n2. **Insta Things Download**: Instagram media downloader tool.\n3. **Resume ATS Scanner**: ATS CV scoring app.\n4. **Docs Editor**: Live rich-text document collaboration.";
        } else if (cmd.includes("/skill") || cmd.includes("/tech")) {
          reply =
            "Core Stack:\n• **Frontend**: React, Next.js, TypeScript\n• **Styling**: CSS, Sass, Tailwind CSS\n• **Backend**: Node.js, Express, Bun, tRPC\n• **Databases**: PostgreSQL, MongoDB\n• **Tools**: Git, GitHub, Docker";
        } else if (cmd.includes("/contact")) {
          reply =
            "Get in touch:\n• Email: kuldeeprajput.dev@gmail.com\n• Twitter: @kuldeepdotcom\n• LinkedIn: /in/kuldeepdotcom";
        } else if (cmd.includes("/help")) {
          reply =
            "Available Commands:\n• `/start` - Start the helper\n• `/projects` - List developer projects\n• `/skills` - View technical skill list\n• `/contact` - Get direct emails/socials";
        }

        setChats((prev) =>
          prev.map((c) =>
            c.id === "bot"
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: Date.now() + 1,
                      text: reply,
                      sender: "them",
                      time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      status: "read",
                    },
                  ],
                }
              : c,
          ),
        );
      }, 1500);
    } else if (activeChat.id === "kuldeep") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        let reply =
          "Awesome! Thanks for reaching out. I'll get back to you as soon as I'm back at my workstation. 💻";
        const normalized = userMessageText.toLowerCase();

        if (
          normalized.includes("hello") ||
          normalized.includes("hi") ||
          normalized.includes("hey")
        ) {
          reply = "Hey! Hope you are enjoying the macOS portfolio. How's everything going?";
        } else if (
          normalized.includes("hiring") ||
          normalized.includes("job") ||
          normalized.includes("work")
        ) {
          reply =
            "I'm currently open to new roles and freelancing opportunities! Let's schedule a call. Drop me a line at kuldeeprajput.dev@gmail.com.";
        }

        setChats((prev) =>
          prev.map((c) =>
            c.id === "kuldeep"
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: Date.now() + 2,
                      text: reply,
                      sender: "them",
                      time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      status: "read",
                    },
                  ],
                }
              : c,
          ),
        );
      }, 1800);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newChatObj = {
      id: `group_${Date.now()}`,
      name: newGroupName,
      type: "group",
      avatarColor: "bg-gradient-to-tr from-yellow-500 to-amber-600",
      initials: newGroupName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      status: "1 member",
      username: `@${newGroupName.toLowerCase().replace(/ /g, "_")}`,
      bio: "A custom group created by user.",
      phone: "None",
      messages: [
        {
          id: 1,
          text: `Group "${newGroupName}" has been successfully created.`,
          sender: "them",
          time: "Just now",
          status: "read",
          senderName: "System",
        },
      ],
    };
    setChats((prev) => [newChatObj, ...prev]);
    setActiveChatId(newChatObj.id);
    setNewGroupName("");
    setIsDrawerOpen(false);
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    const newChatObj = {
      id: `channel_${Date.now()}`,
      name: newChannelName,
      type: "channel",
      avatarColor: "bg-gradient-to-tr from-rose-500 to-red-600",
      initials: newChannelName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      status: "0 subscribers",
      username: `@${newChannelName.toLowerCase().replace(/ /g, "_")}`,
      bio: newChannelBio || "A custom broadcast channel created by user.",
      phone: "None",
      messages: [
        {
          id: 1,
          text: `Channel "${newChannelName}" broadcast stream created.`,
          sender: "channel",
          time: "Just now",
          status: "read",
        },
      ],
    };
    setChats((prev) => [newChatObj, ...prev]);
    setActiveChatId(newChatObj.id);
    setNewChannelName("");
    setNewChannelBio("");
    setIsDrawerOpen(false);
  };

  const openSavedMessages = () => {
    const hasSaved = chats.some((c) => c.id === "saved");
    if (!hasSaved) {
      const savedChat = {
        id: "saved",
        name: "Saved Messages",
        type: "user",
        avatarColor: "bg-gradient-to-tr from-blue-600 to-sky-700",
        initials: "🔖",
        status: "personal cloud storage",
        username: "@my_cloud",
        bio: "Forward messages here to save them. Send media files or notes to store them.",
        phone: "None",
        messages: [
          {
            id: 1,
            text: "Welcome to your personal cloud chat! Write ideas, copy logs, or save clips here.",
            sender: "them",
            time: "Just now",
            status: "read",
          },
        ],
      };
      setChats((prev) => [savedChat, ...prev]);
    }
    setActiveChatId("saved");
    setIsDrawerOpen(false);
  };

  const filteredChats = chats.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getThemeClass = (isMe) => {
    if (!isMe) {
      return nightMode
        ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80"
        : "bg-white text-gray-800 border border-zinc-200/50";
    }
    switch (chatThemeColor) {
      case "green":
        return "bg-emerald-500 text-white border border-emerald-600";
      case "purple":
        return "bg-purple-500 text-white border border-purple-600";
      case "orange":
        return "bg-orange-500 text-white border border-orange-600";
      case "blue":
      default:
        return nightMode
          ? "bg-sky-950 text-white border border-sky-900"
          : "bg-[#eef5fd] text-gray-900 border border-blue-100";
    }
  };

  return {
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    inputText,
    setInputText,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    isTyping,
    showProfileDrawer,
    setShowProfileDrawer,
    nightMode,
    setNightMode,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerSection,
    setDrawerSection,
    userProfile,
    setUserProfile,
    newGroupName,
    setNewGroupName,
    newChannelName,
    setNewChannelName,
    newChannelBio,
    setNewChannelBio,
    chatThemeColor,
    setChatThemeColor,
    messagesEndRef,
    activeChat,
    handleSend,
    handleCreateGroup,
    handleCreateChannel,
    openSavedMessages,
    filteredChats,
    getThemeClass,
  };
};

export default useTelegram;
