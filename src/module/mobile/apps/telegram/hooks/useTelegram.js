import { useState, useEffect, useRef } from "react";
import { INITIAL_CHATS } from "../data";

const useTelegram = () => {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("macos_portfolio_telegram");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((c) => {
          const match = INITIAL_CHATS.find((ic) => ic.id === c.id);
          if (match && match.avatar && !c.avatar) {
            return { ...c, avatar: match.avatar };
          }
          return c;
        });
      } catch (e) {
        console.error(e);
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

  const [activeCall, setActiveCall] = useState(null);
  const [callDuration, setCallDuration] = useState("00:00");
  const callTimerRef = useRef(null);
  const callAudioRef = useRef(null);
  const callingTimeoutRef = useRef(null);
  const ringingTimeoutRef = useRef(null);

  const [callLogs, setCallLogs] = useState(() => {
    const saved = localStorage.getItem("macos_portfolio_telegram_calls");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        name: "Kuldeep (Developer)",
        type: "outgoing",
        time: "Yesterday, 2:14 PM",
        missed: false,
        avatarColor: "bg-gradient-to-tr from-blue-500 to-indigo-600",
        initials: "K",
        avatar: "/images/profile.webp",
      },
      {
        name: "Telegram Assistant Bot",
        type: "incoming",
        time: "Tuesday, 11:00 AM",
        missed: false,
        avatarColor: "bg-gradient-to-tr from-cyan-400 to-sky-600",
        initials: "TB",
        avatar: "/images/telegram/bot.webp",
      },
      {
        name: "Mom",
        type: "missed",
        time: "Sunday, 5:42 PM",
        missed: true,
        avatarColor: "bg-gradient-to-tr from-purple-500 to-pink-600",
        initials: "M",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("macos_portfolio_telegram_calls", JSON.stringify(callLogs));
  }, [callLogs]);

  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (callingTimeoutRef.current) clearTimeout(callingTimeoutRef.current);
      if (ringingTimeoutRef.current) clearTimeout(ringingTimeoutRef.current);
      if (callAudioRef.current) {
        callAudioRef.current.pause();
        callAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (activeCall?.status === "Connected") {
      let seconds = 0;
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      callTimerRef.current = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60)
          .toString()
          .padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        setCallDuration(`${mins}:${secs}`);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    };
  }, [activeCall?.status]);

  const handlePlaceCall = (name, avatarColor, initials, avatar) => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (callAudioRef.current) {
      callAudioRef.current.pause();
      callAudioRef.current = null;
    }
    if (callingTimeoutRef.current) clearTimeout(callingTimeoutRef.current);
    if (ringingTimeoutRef.current) clearTimeout(ringingTimeoutRef.current);

    try {
      const audio = new Audio("/sound/callertune.mp3");
      audio.loop = true;
      audio.play().catch((err) => console.log("Audio play blocked by browser:", err));
      callAudioRef.current = audio;
    } catch (e) {
      console.error("Audio playback error:", e);
    }

    setActiveCall({
      name,
      avatarColor: avatarColor || "bg-gradient-to-tr from-zinc-500 to-zinc-600",
      initials:
        initials ||
        name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      avatar,
      status: "Calling...",
    });
    setCallDuration("00:00");

    callingTimeoutRef.current = setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: "Ringing..." } : null));
    }, 1000);

    ringingTimeoutRef.current = setTimeout(() => {
      if (callAudioRef.current) {
        callAudioRef.current.pause();
        callAudioRef.current = null;
      }
      setActiveCall((prev) => {
        if (!prev) return null;
        return { ...prev, status: "Connected" };
      });
    }, 2500);
  };

  const handleEndCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (callAudioRef.current) {
      callAudioRef.current.pause();
      callAudioRef.current = null;
    }
    if (callingTimeoutRef.current) {
      clearTimeout(callingTimeoutRef.current);
      callingTimeoutRef.current = null;
    }
    if (ringingTimeoutRef.current) {
      clearTimeout(ringingTimeoutRef.current);
      ringingTimeoutRef.current = null;
    }
    if (activeCall) {
      const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newLog = {
        name: activeCall.name,
        avatarColor: activeCall.avatarColor,
        initials: activeCall.initials,
        avatar: activeCall.avatar,
        type: "outgoing",
        time: `Today, ${timeString}`,
        missed: false,
      };
      setCallLogs((prev) => [newLog, ...prev]);
    }
    setActiveCall(null);
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("macos_portfolio_telegram", JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    } else if (activeChat.type === "user" && activeChat.id !== "saved") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          `Hey! Thanks for the message. I'm currently away, but I'll write back soon!`,
          `Interesting point! Let's discuss this further when I'm free.`,
          `Got your message! Hope you are enjoying this macOS portfolio simulator.`,
          `Thanks! Let me know if you have any questions or feedback.`,
        ];
        const randomReply = responses[Math.floor(Math.random() * responses.length)];
        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChat.id
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: Date.now() + 3,
                      text: randomReply,
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
    } else if (activeChat.type === "group") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const memberNames = ["Amit", "Sneha", "Rohan", "Priya", "System"];
        const randomName = memberNames[Math.floor(Math.random() * memberNames.length)];
        const responses = [
          `Hey! That's awesome. React and Next.js is definitely the future.`,
          `I totally agree with that. Did anyone see the latest Tailwind CSS release notes?`,
          `Let's do a virtual meet next week to share code!`,
          `That sounds cool. Let's see if anyone has a better solution.`,
        ];
        const randomReply = responses[Math.floor(Math.random() * responses.length)];
        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChat.id
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: Date.now() + 4,
                      text: randomReply,
                      sender: "them",
                      time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      status: "read",
                      senderName: randomName,
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

  const openOrCreateChat = (contactId, name, initials, color, status, bio, avatar) => {
    const hasChat = chats.some((c) => c.id === contactId);
    if (!hasChat) {
      const newChatObj = {
        id: contactId,
        name: name,
        type: "user",
        avatar: avatar,
        avatarColor: color || "bg-gradient-to-tr from-zinc-500 to-zinc-600",
        initials:
          initials ||
          name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        status: status || "online",
        username: `@${name.toLowerCase().replace(/[\s()]/g, "_")}`,
        bio: bio || `This is a private chat with ${name}.`,
        phone: "+91 ••••• •••••",
        messages: [
          {
            id: Date.now(),
            text: `Hey! This is a private chat with ${name}.`,
            sender: "them",
            time: "Just now",
            status: "read",
          },
        ],
      };
      setChats((prev) => [newChatObj, ...prev]);
    }
    setActiveChatId(contactId);
    setIsDrawerOpen(false);
  };

  const openSavedMessages = () => {
    openOrCreateChat(
      "saved",
      "Saved Messages",
      "🔖",
      "bg-gradient-to-tr from-blue-600 to-sky-700",
      "personal cloud storage",
      "Forward messages here to save them. Send media files or notes to store them.",
    );
  };

  const handleDeleteChat = (chatId) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) {
      const remaining = chats.filter((c) => c.id !== chatId);
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      } else {
        setActiveChatId("bot");
      }
    }
  };

  const filteredChats = chats.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getThemeClass = (isMe) => {
    if (!isMe) {
      return nightMode
        ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80 animate-in fade-in duration-100"
        : "bg-white text-zinc-900 border border-zinc-200/40 rounded-tl-none animate-in fade-in duration-100";
    }
    switch (chatThemeColor) {
      case "green":
        return nightMode
          ? "bg-emerald-950 text-white border border-emerald-900"
          : "bg-[#e2f7cb] text-zinc-900 border border-[#d4f2bd] rounded-tr-none";
      case "purple":
        return nightMode
          ? "bg-purple-950 text-white border border-purple-900"
          : "bg-[#f1ebfc] text-zinc-900 border border-[#e4dafa] rounded-tr-none";
      case "orange":
        return nightMode
          ? "bg-amber-950 text-white border border-amber-900"
          : "bg-[#fdf0e6] text-zinc-900 border border-[#fbe2cf] rounded-tr-none";
      case "blue":
      default:
        return nightMode
          ? "bg-sky-950 text-white border border-sky-900"
          : "bg-[#e1f3fc] text-zinc-900 border border-[#d2ebf7] rounded-tr-none";
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
    openOrCreateChat,
    openSavedMessages,
    handleDeleteChat,
    filteredChats,
    getThemeClass,
    activeCall,
    setActiveCall,
    callDuration,
    callLogs,
    setCallLogs,
    handlePlaceCall,
    handleEndCall,
  };
};

export default useTelegram;
