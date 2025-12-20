












// "use client";
// import { useState } from "react";
// import Terminal from "@/components/Terminal";
// import ChatInterface from "@/components/ChatInterface";
// import { useChat } from "@/hooks/useChat";

// const SidebarIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
// );

// export default function Home() {
//   const { messages, loading, sendMessage } = useChat();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <div className="flex h-screen w-full bg-[#0b0d10] text-[#c9d1d9] font-sans overflow-hidden">
//       <ChatInterface 
//         messages={messages} 
//         loading={loading} 
//         onSendMessage={sendMessage} 
//         isOpen={isSidebarOpen} 
//       />

//       <main className="flex-1 flex flex-col min-w-0 bg-[#0b0d10] relative">
//         <button 
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="absolute top-3 left-3 z-10 p-2 bg-[#1f6feb] text-white rounded hover:bg-[#388bfd] transition-colors shadow-lg border border-transparent hover:border-white/20"
//           title={isSidebarOpen ? "Collapse Chat" : "Expand Chat"}
//         >
//           <SidebarIcon />
//         </button>

//         <div className="h-14 flex items-center justify-end px-6 border-b border-[#30363d] bg-[#0d1117]">
//             <div className="flex items-center gap-3">
//                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f6feb]/10 border border-[#1f6feb]/20">
//                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//                   <span className="text-xs font-mono text-[#58a6ff]">DAEMON: ACTIVE</span>
//                </div>
//                <div className="text-xs text-[#8b949e] font-mono">v24.0.6</div>
//             </div>
//         </div>

//         <div className="flex-1 p-6 overflow-hidden flex flex-col">
//             <div className="flex items-center justify-between mb-2">
//                 <h2 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest">Live System Logs</h2>
//             </div>
            
//             <div className="flex-1 border border-[#30363d] rounded-lg overflow-hidden bg-black shadow-2xl relative group">
//                 <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-[#1f6feb]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
//                 <div className="h-full w-full">
//                     <Terminal />
//                 </div>
//             </div>
//         </div>
//       </main>
//     </div>
//   );
// }










"use client";
import { useState, useEffect } from "react";
import Terminal from "@/components/Terminal";
import ChatInterface from "@/components/ChatInterface";
import ResultBoard from "@/components/ResultBoard";
import { useChat } from "@/hooks/useChat";

const Icons = {
  Terminal: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
  ),
  Board: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
  ),
  Sidebar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
  )
};

export default function Home() {
  const { messages, loading, sendMessage, activeResult } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("terminal");

  useEffect(() => {
    if (activeResult) {
      setViewMode("board");
    }
  }, [activeResult]);

  return (
    <div className="flex h-screen w-full bg-[#0b0d10] text-[#c9d1d9] font-sans overflow-hidden">
      <ChatInterface
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
        isOpen={isSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0d10] relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-3 left-3 z-10 p-2 bg-[#1f6feb] text-white rounded hover:bg-[#388bfd] transition-colors shadow-lg border border-transparent hover:border-white/20"
          title={isSidebarOpen ? "Collapse Chat" : "Expand Chat"}
        >
          <Icons.Sidebar />
        </button>

        <div className="h-14 flex items-center justify-end px-6 border-b border-[#30363d] bg-[#0d1117] gap-4">
          <div className="flex bg-[#21262d] rounded-lg p-1 border border-[#30363d]">
            <button
              onClick={() => setViewMode("terminal")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all
                ${viewMode === "terminal" ? "bg-[#30363d] text-white shadow-sm" : "text-[#8b949e] hover:text-[#c9d1d9]"}`}
            >
              <Icons.Terminal /> TERMINAL
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all
                ${viewMode === "board" ? "bg-[#1f6feb] text-white shadow-sm" : "text-[#8b949e] hover:text-[#c9d1d9]"}`}
            >
              <Icons.Board /> RESULT BOARD
            </button>
          </div>

          <div className="w-px h-6 bg-[#30363d]"></div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f6feb]/10 border border-[#1f6feb]/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-mono text-[#58a6ff]">DAEMON: ACTIVE</span>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest">
              {viewMode === "terminal" ? "Live System Logs" : "Command Output Viewer"}
            </h2>
          </div>

          <div className="flex-1 border border-[#30363d] rounded-lg overflow-hidden bg-black shadow-2xl relative group">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-[#1f6feb]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-full w-full relative z-0">
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
