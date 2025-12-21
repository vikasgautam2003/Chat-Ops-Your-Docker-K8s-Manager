









// "use client";
// import { useState, useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// const Icons = {
//   Send: () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
//   ),
//   Docker: () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#0db7ed]"><path d="M4.82 17.275c-.684 0-1.304-.56-1.304-1.24s.56-1.243 1.305-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.56 1.24-1.31 1.24zM4.965 13.634c-.684 0-1.305-.56-1.305-1.24s.56-1.243 1.304-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.562 1.24-1.31 1.24zm-1.304-4.81c0-.68.62-1.24 1.304-1.24.75 0 1.31.56 1.31 1.24s-.56 1.24-1.31 1.24c-.684 0-1.304-.56-1.304-1.24zm4.27 4.81c-.683 0-1.304-.56-1.304-1.24s.56-1.243 1.304-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.56 1.24-1.31 1.24zm0-3.567c-.683 0-1.304-.56-1.304-1.24s.56-1.243 1.304-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.56 1.24-1.31 1.24zm0-3.57c0-.68.62-1.24 1.304-1.24.75 0 1.31.56 1.31 1.24s-.56 1.24-1.31 1.24c-.683 0-1.304-.56-1.304-1.24zm4.332 7.137c-.684 0-1.305-.56-1.305-1.24s.56-1.243 1.305-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.562 1.24-1.31 1.24zm0-3.568c-.684 0-1.305-.56-1.305-1.24s.56-1.243 1.305-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.56 1.24-1.31 1.24zm0-3.57c0-.68.62-1.24 1.305-1.24.748 0 1.31.56 1.31 1.24s-.562 1.24-1.31 1.24c-.684 0-1.305-.56-1.305-1.24zm11.75 6.556c-.31 2.37-2.11 2.89-4.593 3.014-2.857.14-5.903.07-7.61-.096-.993-.1-1.677-.285-1.996-.864-.17-.306-.236-.677-.236-1.332 0-3.21 0-4.14.02-4.217h12.55c.153 0 .275.02.392.056.88.27 1.372 1.455 1.472 3.44z"/></svg>
//   ),
//   Robot: () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M9 14v2"/><path d="M15 14v2"/><line x1="12" y1="6" x2="12" y2="2"/></svg>
//   )
// };

// export default function ChatInterface({ messages, loading, onSendMessage, isOpen }) {
//   const [input, setInput] = useState("");
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     onSendMessage(input);
//     setInput("");
//   };

//   return (
//     <aside
//       className={`flex flex-col border-r border-[#30363d] bg-[#0d1117] transition-all duration-300 ease-in-out relative
//         ${isOpen ? "w-[350px] min-w-[300px]" : "w-0 overflow-hidden opacity-0"}`}
//     >
//       <div className="h-14 flex items-center justify-between px-4 border-b border-[#30363d] bg-[#161b22]">
//         <div className="flex items-center gap-2 font-semibold text-white tracking-wide">
//           <Icons.Docker />
//           <span>AI CONTROLLER</span>
//         </div>
//       </div>

//       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
//         {messages.length === 0 && (
//           <div className="text-center mt-20 opacity-50 text-sm">
//             <div className="mb-2">System Ready.</div>
//             <div className="text-xs">Waiting for command inputs...</div>
//           </div>
//         )}

//         {messages.map((m, i) => {
//           const isUser = m.role === "user";
//           return (
//             <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`max-w-[90%] rounded-lg p-3 text-sm leading-relaxed shadow-sm border overflow-hidden
//                   ${isUser ? "bg-[#1f6feb] border-[#1f6feb] text-white" : "bg-[#21262d] border-[#30363d] text-[#c9d1d9]"}`}
//               >
//                 {!isUser && (
//                   <div className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-2 flex items-center gap-1">
//                     <Icons.Robot /> System
//                   </div>
//                 )}

//                 <div className="markdown-content">
//                   <ReactMarkdown
//                     remarkPlugins={[remarkGfm]}
//                     components={{
//                       code({ inline, children, ...props }) {
//                         return inline ? (
//                           <code className={`px-1 py-0.5 rounded ${isUser ? "bg-blue-700" : "bg-[#30363d]"} font-mono text-xs`} {...props}>
//                             {children}
//                           </code>
//                         ) : (
//                           <div className="my-2 overflow-x-auto rounded">
//                             <code className={`block p-2 ${isUser ? "bg-[#0d1117]/30" : "bg-[#0d1117]"} font-mono text-xs whitespace-pre`} {...props}>
//                               {children}
//                             </code>
//                           </div>
//                         );
//                       },
//                       p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
//                       ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
//                       ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
//                       a: ({ href, children }) => (
//                         <a href={href} className="underline decoration-white/50 hover:text-white" target="_blank" rel="noopener noreferrer">
//                           {children}
//                         </a>
//                       ),
//                     }}
//                   >
//                     {m.parts[0].text}
//                   </ReactMarkdown>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {loading && (
//           <div className="flex justify-start animate-pulse">
//             <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-3 text-xs text-[#8b949e]">
//               Processing...
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-t border-[#30363d] bg-[#161b22]">
//         <form onSubmit={handleSubmit} className="relative">
//           <input
//             className="w-full bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-md pl-4 pr-10 py-3 focus:outline-none focus:border-[#0db7ed] focus:ring-1 focus:ring-[#0db7ed] transition-all placeholder-[#484f58]"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a command..."
//           />
//           <button
//             type="submit"
//             disabled={!input.trim() || loading}
//             className="absolute right-2 top-2 p-1.5 text-[#8b949e] hover:text-white disabled:opacity-30 transition-colors"
//           >
//             <Icons.Send />
//           </button>
//         </form>
//       </div>
//     </aside>
//   );
// }















"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Icons = {
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Robot: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="12" x="3" y="6" rx="2" />
      <path d="M9 14v2" />
      <path d="M15 14v2" />
      <line x1="12" y1="6" x2="12" y2="2" />
    </svg>
  ),
};

export default function ChatInterface({ messages, loading, onSendMessage, isOpen }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <aside
      className={`flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? "w-[380px] min-w-[320px]" : "w-0 opacity-0 overflow-hidden"}
        bg-[#0b0f14]`}
    >
      {/* Header */}
      <div className="h-14 px-6 flex items-center border-b border-white/5">
        <span className="text-sm font-medium text-white/90">
          AI Assistant
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-6 space-y-5"
      >
        {messages.length === 0 && (
          <div className="mt-28 text-center text-sm text-white/40">
            Ask anything to begin
          </div>
        )}

        {messages.map((m, i) => {
          const isUser = m.role === "user";

          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${isUser
                    ? "bg-[#2563eb] text-white rounded-br-md"
                    : "bg-white/5 text-white/90 rounded-bl-md"}`}
              >
                {!isUser && (
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-white/40">
                    <Icons.Robot />
                    Assistant
                  </div>
                )}

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    code({ inline, children, ...props }) {
                      return inline ? (
                        <code
                          className="px-1.5 py-0.5 rounded bg-black/30 text-xs font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <pre className="mt-2 rounded-xl bg-black/40 p-3 overflow-x-auto text-xs font-mono">
                          <code {...props}>{children}</code>
                        </pre>
                      );
                    },
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1 mb-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1 mb-2">{children}</ol>
                    ),
                  }}
                >
                  {m.parts[0].text}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-white/5 text-xs text-white/50 animate-pulse">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message…"
            className="w-full rounded-full bg-white/5 px-5 py-3 pr-12
              text-sm text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2
              text-white/50 hover:text-white disabled:opacity-30"
          >
            <Icons.Send />
          </button>
        </form>
      </div>
    </aside>
  );
}

