import windowWrapper from "@hoc/windowWrapper";
import { useEffect, useState } from "react";
import useMessages from "../../hooks/useMessages";
import MessagesSection from "../section/MessagesSection";

const Messages = () => {
  const {
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
    formatCallTime,
    setCallState,
    pinnedChats,
    togglePinChat,
    activeCategory,
    setActiveCategory,
    addReaction,
    sendAttachment,
  } = useMessages();
  const [forwardTarget, setForwardTarget] = useState(null);

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app !== "messages") return;

      if (callState.isOpen) {
        e.preventDefault();
        endCall();
        setForwardTarget(null);
      } else if (showInfo) {
        e.preventDefault();
        setShowInfo(false);
        setForwardTarget("info");
      } else if (!isSidebarOpen) {
        e.preventDefault();
        setIsSidebarOpen(true);
        setForwardTarget("chat");
      }
    };

    const handleNavForward = (e) => {
      if (e.detail?.app !== "messages" || !forwardTarget) return;

      if (forwardTarget === "info" && !showInfo && !isSidebarOpen) {
        e.preventDefault();
        setShowInfo(true);
        setForwardTarget(null);
      } else if (forwardTarget === "chat" && isSidebarOpen) {
        e.preventDefault();
        setIsSidebarOpen(false);
        setForwardTarget(null);
      }
    };

    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [
    callState.isOpen,
    endCall,
    forwardTarget,
    isSidebarOpen,
    setIsSidebarOpen,
    setShowInfo,
    showInfo,
  ]);

  return (
    <MessagesSection
      conversations={conversations}
      activeChat={activeChat}
      activeChatId={activeChatId}
      setActiveChatId={setActiveChatId}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      inputText={inputText}
      setInputText={setInputText}
      isTyping={isTyping}
      showInfo={showInfo}
      setShowInfo={setShowInfo}
      mutedChats={mutedChats}
      setMutedChats={setMutedChats}
      callState={callState}
      callDuration={callDuration}
      messagesEndRef={messagesEndRef}
      triggerCall={triggerCall}
      onEndCall={endCall}
      onMicToggle={() => setCallState((prev) => ({ ...prev, micMuted: !prev.micMuted }))}
      onCameraToggle={() => setCallState((prev) => ({ ...prev, cameraOff: !prev.cameraOff }))}
      handleSend={handleSend}
      formatCallTime={formatCallTime}
      pinnedChats={pinnedChats}
      togglePinChat={togglePinChat}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      addReaction={addReaction}
      sendAttachment={sendAttachment}
    />
  );
};

const MessagesWindow = windowWrapper(Messages, "messages");
export default MessagesWindow;
