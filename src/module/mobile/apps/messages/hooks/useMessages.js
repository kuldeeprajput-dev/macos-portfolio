import { useState, useEffect, useRef, useCallback } from "react";
import { INITIAL_CONVERSATIONS } from "../data";

const useMessages = () => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("macos_portfolio_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((c) => c.messages && c.messages.length > 0)
        ) {
          return parsed.map((c) => {
            const match = INITIAL_CONVERSATIONS.find((init) => init.id === c.id);
            if (match) {
              return {
                ...c,
                name: match.name,
                avatar: match.avatar,
                initials: match.initials,
              };
            }
            return c;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [pinnedChats, setPinnedChats] = useState(() => {
    const saved = localStorage.getItem("macos_portfolio_pinned_messages");
    return saved ? JSON.parse(saved) : ["kuldeep"];
  });

  const [activeCategory, setActiveCategory] = useState("all"); // "all", "unread", "muted"
  const [activeChatId, setActiveChatId] = useState("kuldeep");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mutedChats, setMutedChats] = useState({});
  const [callState, setCallState] = useState({
    isOpen: false,
    type: "audio",
    status: "ringing",
    micMuted: false,
    cameraOff: false,
  });
  const [callDuration, setCallDuration] = useState(0);
  const messagesEndRef = useRef(null);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  useEffect(() => {
    localStorage.setItem("macos_portfolio_messages", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("macos_portfolio_pinned_messages", JSON.stringify(pinnedChats));
  }, [pinnedChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isTyping]);

  useEffect(() => {
    if (activeChat?.unread) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeChat.id ? { ...c, unread: false } : c)),
      );
    }
  }, [activeChat]);

  const ringtoneRef = useRef(null);

  useEffect(() => {
    if (callState.isOpen && callState.status === "ringing") {
      if (!ringtoneRef.current) {
        ringtoneRef.current = new Audio("/sound/callertune.mp3");
        ringtoneRef.current.loop = true;
      }
      ringtoneRef.current
        .play()
        .catch((e) => console.error("Ringtone playback blocked/failed:", e));
    } else {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
    }
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
      }
    };
  }, [callState.isOpen, callState.status]);

  useEffect(() => {
    let ringTimer;
    if (callState.isOpen && callState.status === "ringing") {
      ringTimer = setTimeout(() => {
        setCallState((prev) => ({ ...prev, status: "connected" }));
      }, 6000);
    }
    return () => clearTimeout(ringTimer);
  }, [callState.isOpen, callState.status]);

  useEffect(() => {
    let callTimer;
    if (callState.isOpen && callState.status === "connected") {
      callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(callTimer);
  }, [callState.isOpen, callState.status]);

  const triggerCall = useCallback((type) => {
    setCallState({ isOpen: true, type, status: "ringing", micMuted: false, cameraOff: false });
  }, []);

  const endCall = useCallback(() => {
    setCallState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const togglePinChat = useCallback((id) => {
    setPinnedChats((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  }, []);

  const addReaction = useCallback(
    (messageId, reaction) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChat.id) {
            return {
              ...c,
              messages: c.messages.map((m) => {
                if (m.id === messageId) {
                  const currentReactions = m.reactions || [];
                  const nextReactions = currentReactions.includes(reaction)
                    ? currentReactions.filter((r) => r !== reaction)
                    : [...currentReactions, reaction];
                  return { ...m, reactions: nextReactions };
                }
                return m;
              }),
            };
          }
          return c;
        }),
      );
    },
    [activeChat],
  );

  const sendAttachment = useCallback(
    (type, value) => {
      const newMessage = {
        id: Date.now(),
        text: type === "photo" ? "📷 Sent a photo" : `🎨 Sticker: ${value}`,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        attachment: { type, value },
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChat.id ? { ...c, messages: [...c.messages, newMessage] } : c,
        ),
      );

      // Kuldeep chatbot reply triggers
      if (activeChat.id === "kuldeep") {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const replyMessage = {
            id: Date.now() + 1,
            text:
              type === "photo"
                ? "Wow, that looks amazing! Thanks for sharing."
                : "Haha, I love that sticker! 😂",
            sender: "them",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setConversations((prev) =>
            prev.map((c) =>
              c.id === "kuldeep" ? { ...c, messages: [...c.messages, replyMessage] } : c,
            ),
          );
        }, 1200);
      }
    },
    [activeChat],
  );

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [...c.messages, newMessage] } : c,
      ),
    );

    const userMsg = inputText.toLowerCase();
    setInputText("");

    if (activeChat.id === "kuldeep") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        let replyText = "That's cool! Feel free to explore other apps in the dock too.";
        if (userMsg.includes("project")) {
          replyText =
            "I have built several cool projects! You can check them out in the 'Portfolio' Finder app, or view 'NewTube', 'Snsta', and 'Docs Editor'.";
        } else if (
          userMsg.includes("skill") ||
          userMsg.includes("tech") ||
          userMsg.includes("stack")
        ) {
          replyText =
            "My primary tech stack includes React, Next.js, TypeScript, Node.js, Express, Bun, Tailwind CSS, PostgreSQL, and MongoDB. Open the 'Skills' Terminal app to see the complete list!";
        } else if (
          userMsg.includes("contact") ||
          userMsg.includes("mail") ||
          userMsg.includes("hire")
        ) {
          replyText =
            "You can contact me via email at kuldeeprajput.dev@gmail.com, or check out my socials (Github, LinkedIn) in the Safari app!";
        } else if (userMsg.includes("hello") || userMsg.includes("hi") || userMsg.includes("hey")) {
          replyText =
            "Hey there! Hope you are enjoying the macOS portfolio. How can I help you today?";
        }

        const replyMessage = {
          id: Date.now() + 1,
          text: replyText,
          sender: "them",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === "kuldeep" ? { ...c, messages: [...c.messages, replyMessage] } : c,
          ),
        );
      }, 1200);
    }
  }, [inputText, activeChat]);

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return {
    conversations,
    activeChat,
    activeChatId,
    setActiveChatId,
    inputText,
    setInputText,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    isTyping,
    showInfo,
    setShowInfo,
    mutedChats,
    setMutedChats,
    callState,
    callDuration,
    messagesEndRef,
    triggerCall,
    endCall,
    handleSend,
    filteredConversations,
    formatCallTime,
    setCallState,
    pinnedChats,
    togglePinChat,
    activeCategory,
    setActiveCategory,
    addReaction,
    sendAttachment,
  };
};

export default useMessages;
