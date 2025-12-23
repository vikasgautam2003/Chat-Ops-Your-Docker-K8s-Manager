









"use client";
import { useState, useEffect } from "react";
import Terminal from "@/components/Terminal";
import ChatInterface from "@/components/ChatInterface";
import ResultBoard from "@/components/ResultBoard";
import ImageStore from "@/components/ImageStore";
import { useChat } from "@/hooks/useChat";



const Icons = {
  Terminal: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Board: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  Sidebar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
};

export default function Home() {
  const {
    messages,
    loading,
    sendMessage,
    activeResult,
    storeData,
    isStoreOpen,
    setIsStoreOpen,
  } = useChat();

   




  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("terminal");



  useEffect(() => {
    if (activeResult) setViewMode("board");
  }, [activeResult]);

  const handleInstallImage = (imageName) => {
    setIsStoreOpen(false);
    sendMessage(`System: User selected '${imageName}'. Pull this image now.`);
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0d10] text-[#c9d1d9] overflow-hidden">
      <ImageStore
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        data={storeData}
        onInstall={handleInstallImage}
      />

      <ChatInterface
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
        isOpen={isSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0 relative bg-[#0b0d10]">
     
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-20 p-2 rounded-full
            bg-white/5 hover:bg-white/10 backdrop-blur
            text-white transition shadow-lg"
        >
          <Icons.Sidebar />
        </button>

   
        <div className="h-14 flex items-center justify-end px-6 gap-4 border-b border-white/5">
          <div className="flex bg-white/5 rounded-full p-1">
            <button
              onClick={() => setViewMode("terminal")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition
                ${viewMode === "terminal"
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white"}`}
            >
              <Icons.Terminal /> Terminal
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition
                ${viewMode === "board"
                  ? "bg-[#1f6feb] text-white"
                  : "text-white/50 hover:text-white"}`}
            >
              <Icons.Board /> Results
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ACTIVE
          </div>
        </div>

        {/* MAIN CANVAS — FULL SPACE */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            <div className="h-full w-full">
              {viewMode === "terminal" ? (
                <Terminal />
              ) : (
                <ResultBoard result={activeResult} />
              )}
            </div>
          </div>
        </div>
      </main>
     

    </div>
  );
}
