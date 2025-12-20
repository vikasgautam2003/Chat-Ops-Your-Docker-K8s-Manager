










// "use client";
// import { useState } from "react";
// import Terminal from "@/components/Terminal";

// export default function Home() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

// // Inside page.js

// async function handleSend(e) {
//   e.preventDefault();
//   if (!input.trim()) return;

//   const userMsg = { role: "user", parts: [{ text: input }] };
//   const history = [...messages, userMsg]; // Send full history for context
//   setMessages(history);
//   setInput("");
//   setLoading(true);

//   try {
//     // 1. Ask Gemini what to do
//     const res1 = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         history, 
//         message: input, 
//         // We removed 'tools' here because they are now hardcoded in the route.js
//       }),
//     });

//     const data1 = await res1.json();

//     if (data1.toolRequest) {
//       // ⚡ DYNAMIC EXECUTION
//       // If Gemini wants "stop_container", we hit /tools/stop_container
//       const toolName = data1.toolRequest.name;
//       const toolArgs = data1.toolRequest.args;

//       console.log(`Executing Tool: ${toolName}`, toolArgs);

//       const toolRes = await fetch(`http://localhost:3001/tools/${toolName}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(toolArgs), // Pass arguments (like containerId)
//       });
      
//       const toolData = await toolRes.json();

//       // 2. Send result back to Gemini
//      const res2 = await fetch("/api/chat", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     history: [
//       ...history,
//       {
//         role: "user",
//         parts: [
//           {
//             functionResponse: {
//               name: toolName,
//               response: {
//                 result: JSON.stringify(toolData.result),
//               },
//             },
//           },
//         ],
//       },
//     ],
//   }),
// });


//       const data2 = await res2.json();

//       setMessages((p) => [
//         ...p,
//         { role: "model", parts: [{ text: data2.text }] },
//       ]);
//     } else {
//       // Standard text response
//       setMessages((p) => [
//         ...p,
//         { role: "model", parts: [{ text: data1.text }] },
//       ]);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("Error processing request");
//   } finally {
//     setLoading(false);
//   }
// }

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
//       <div className="w-full max-w-4xl mb-6">
//         <h2 className="text-sm text-gray-400 mb-2 font-mono">SYSTEM ACTIVITY LOG</h2>
//         <Terminal />
//       </div>
//       <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 mb-20 h-[60vh] overflow-y-auto">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`mb-3 p-3 rounded ${
//               m.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
//             }`}
//           >
//             {m.parts[0].text}
//           </div>
//         ))}
//         {loading && <div className="text-gray-400">Thinking...</div>}
//       </div>

//       <form
//         onSubmit={handleSend}
//         className="fixed bottom-0 w-full max-w-2xl p-4 bg-gray-900 border-t border-gray-700"
//       >
//         <input
//           className="w-full p-3 rounded bg-gray-800 border border-gray-600"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Commands..."
//         />
//       </form>
//     </div>
//   );
// }











// "use client";
// import { useState } from "react";
// import Terminal from "@/components/Terminal";

// export default function Home() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

// // Inside page.js

// async function handleSend(e) {
//   e.preventDefault();
//   if (!input.trim()) return;

//   const userMsg = { role: "user", parts: [{ text: input }] };
//   const history = [...messages, userMsg]; // Send full history for context
//   setMessages(history);
//   setInput("");
//   setLoading(true);

//   try {
//     // 1. Ask Gemini what to do
//     const res1 = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         history, 
//         message: input, 
//         // We removed 'tools' here because they are now hardcoded in the route.js
//       }),
//     });

//     const data1 = await res1.json();

//     if (data1.toolRequest) {
//       // ⚡ DYNAMIC EXECUTION
//       // If Gemini wants "stop_container", we hit /tools/stop_container
//       const toolName = data1.toolRequest.name;
//       const toolArgs = data1.toolRequest.args;

//       console.log(`Executing Tool: ${toolName}`, toolArgs);

//       const toolRes = await fetch(`http://localhost:3001/tools/${toolName}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(toolArgs), // Pass arguments (like containerId)
//       });
      
//       const toolData = await toolRes.json();

//       // 2. Send result back to Gemini
//       const res2 = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           history,
//           message: [
//             {
//               functionResponse: {
//                 name: toolName,
//                 response: { result: JSON.stringify(toolData.result) },
//               },
//             },
//           ],
//         }),
//       });

//       const data2 = await res2.json();

//       setMessages((p) => [
//         ...p,
//         { role: "model", parts: [{ text: data2.text }] },
//       ]);
//     } else {
//       // Standard text response
//       setMessages((p) => [
//         ...p,
//         { role: "model", parts: [{ text: data1.text }] },
//       ]);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("Error processing request");
//   } finally {
//     setLoading(false);
//   }
// }

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
//       <div className="w-full max-w-4xl mb-6">
//         <h2 className="text-sm text-gray-400 mb-2 font-mono">SYSTEM ACTIVITY LOG</h2>
//         <Terminal />
//       </div>
//       <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 mb-20 h-[60vh] overflow-y-auto">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`mb-3 p-3 rounded ${
//               m.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
//             }`}
//           >
//             {m.parts[0].text}
//           </div>
//         ))}
//         {loading && <div className="text-gray-400">Thinking...</div>}
//       </div>

//       <form
//         onSubmit={handleSend}
//         className="fixed bottom-0 w-full max-w-2xl p-4 bg-gray-900 border-t border-gray-700"
//       >
//         <input
//           className="w-full p-3 rounded bg-gray-800 border border-gray-600"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Commands..."
//         />
//       </form>
//     </div>
//   );
// }















// "use client";
// import { useState } from "react";
// import Terminal from "@/components/Terminal";

// export default function Home() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

// // Inside page.js

// async function handleSend(e) {
//   e.preventDefault();
//   if (!input.trim()) return;

//   const userMsg = { role: "user", parts: [{ text: input }] };
//   const nextHistory = [...messages, userMsg];

//   setMessages(nextHistory);
//   setInput("");
//   setLoading(true);

//   try {
//     const res1 = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         history: nextHistory,
//         message: input,
//       }),
//     });

//     const data1 = await res1.json();

//     // -----------------------------
//     // TOOL EXECUTION PATH
//     // -----------------------------
//     if (data1.toolRequest) {
//       const toolName = data1.toolRequest.name;
//       const toolArgs = data1.toolRequest.args ?? {};

//       const toolRes = await fetch(
//         `http://localhost:3001/tools/${toolName}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(toolArgs),
//         }
//       );

//       const toolData = await toolRes.json();

//       // 🔴 IMPORTANT: show tool output immediately
//       const toolMessage = {
//         role: "model",
//         parts: [
//           {
//             text: `🛠️ ${toolName} result:\n${JSON.stringify(
//               toolData.result,
//               null,
//               2
//             )}`,
//           },
//         ],
//       };

//       const historyWithTool = [...nextHistory, toolMessage];
//       setMessages(historyWithTool);

//       // Ask model to explain the result
//       const res2 = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           history: historyWithTool,
//           message: `Explain the result of ${toolName} to the user.`,
//         }),
//       });

//       const data2 = await res2.json();

//       if (data2.text) {
//         setMessages((p) => [
//           ...p,
//           { role: "model", parts: [{ text: data2.text }] },
//         ]);
//       }

//       return;
//     }

//     // -----------------------------
//     // NORMAL TEXT RESPONSE
//     // -----------------------------
//     if (data1.text) {
//       setMessages((p) => [
//         ...p,
//         { role: "model", parts: [{ text: data1.text }] },
//       ]);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("Error processing request");
//   } finally {
//     setLoading(false);
//   }
// }

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
//       <div className="w-full max-w-4xl mb-6">
//         <h2 className="text-sm text-gray-400 mb-2 font-mono">SYSTEM ACTIVITY LOG</h2>
//         <Terminal />
//       </div>
//       <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 mb-20 h-[60vh] overflow-y-auto">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`mb-3 p-3 rounded ${
//               m.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
//             }`}
//           >
//             {m.parts[0].text}
//           </div>
//         ))}
//         {loading && <div className="text-gray-400">Thinking...</div>}
//       </div>

//       <form
//         onSubmit={handleSend}
//         className="fixed bottom-0 w-full max-w-2xl p-4 bg-gray-900 border-t border-gray-700"
//       >
//         <input
//           className="w-full p-3 rounded bg-gray-800 border border-gray-600"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Commands..."
//         />
//       </form>
//     </div>
//   );
// }








"use client";
import { useState, useRef, useEffect } from "react";
import Terminal from "@/components/Terminal";

const Icons = {
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  Docker: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#0db7ed]"><path d="M4.82 17.275c-.684 0-1.304-.56-1.304-1.24s.56-1.243 1.305-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.56 1.24-1.31 1.24zM4.965 13.634c-.684 0-1.305-.56-1.305-1.24s.56-1.243 1.304-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.562 1.24-1.31 1.24zm-1.304-4.81c0-.68.62-1.24 1.304-1.24.75 0 1.31.56 1.31 1.24s-.56 1.24-1.31 1.24c-.684 0-1.304-.56-1.304-1.24zm4.27 4.81c-.683 0-1.304-.56-1.304-1.24s.56-1.243 1.304-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.56 1.24-1.31 1.24zm0-3.567c-.683 0-1.304-.56-1.304-1.24s.56-1.243 1.304-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.56 1.24-1.31 1.24zm0-3.57c0-.68.62-1.24 1.304-1.24.75 0 1.31.56 1.31 1.24s-.56 1.24-1.31 1.24c-.683 0-1.304-.56-1.304-1.24zm4.332 7.137c-.684 0-1.305-.56-1.305-1.24s.56-1.243 1.305-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.562 1.24-1.31 1.24zm0-3.568c-.684 0-1.305-.56-1.305-1.24s.56-1.243 1.305-1.243c.748 0 1.31.56 1.31 1.24 0 .684-.56 1.24-1.31 1.24zm0-3.57c0-.68.62-1.24 1.305-1.24.748 0 1.31.56 1.31 1.24s-.562 1.24-1.31 1.24c-.684 0-1.305-.56-1.305-1.24zm11.75 6.556c-.31 2.37-2.11 2.89-4.593 3.014-2.857.14-5.903.07-7.61-.096-.993-.1-1.677-.285-1.996-.864-.17-.306-.236-.677-.236-1.332 0-3.21 0-4.14.02-4.217h12.55c.153 0 .275.02.392.056.88.27 1.372 1.455 1.472 3.44z"/></svg>
  ),
  SidebarLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
  ),
  Robot: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M9 14v2"/><path d="M15 14v2"/><line x1="12" y1="6" x2="12" y2="2"/></svg>
  )
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", parts: [{ text: input }] };
    const nextHistory = [...messages, userMsg];

    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res1 = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: nextHistory,
          message: input,
        }),
      });

      const data1 = await res1.json();

      if (data1.toolRequest) {
        const toolName = data1.toolRequest.name;
        const toolArgs = data1.toolRequest.args ?? {};

        const toolRes = await fetch(
          `http://localhost:3001/tools/${toolName}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toolArgs),
          }
        );

        const toolData = await toolRes.json();

        const toolMessage = {
          role: "model",
          parts: [
            {
              text: `🛠️ ${toolName} result:\n${JSON.stringify(
                toolData.result,
                null,
                2
              )}`,
            },
          ],
        };

        const historyWithTool = [...nextHistory, toolMessage];
        setMessages(historyWithTool);

        const res2 = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            history: historyWithTool,
            message: `Explain the result of ${toolName} to the user.`,
          }),
        });

        const data2 = await res2.json();

        if (data2.text) {
          setMessages((p) => [
            ...p,
            { role: "model", parts: [{ text: data2.text }] },
          ]);
        }
        return;
      }

      if (data1.text) {
        setMessages((p) => [
          ...p,
          { role: "model", parts: [{ text: data1.text }] },
        ]);
      }
    } catch (e) {
      console.error(e);
      alert("Error processing request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#0b0d10] text-[#c9d1d9] font-sans overflow-hidden">
      <aside
        className={`flex flex-col border-r border-[#30363d] bg-[#0d1117] transition-all duration-300 ease-in-out relative
          ${isSidebarOpen ? "w-[350px] min-w-[300px]" : "w-0 overflow-hidden opacity-0"}
        `}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#30363d] bg-[#161b22]">
          <div className="flex items-center gap-2 font-semibold text-white tracking-wide">
            <Icons.Docker />
            <span>AI CONTROLLER</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
          {messages.length === 0 && (
            <div className="text-center mt-20 opacity-50 text-sm">
              <div className="mb-2">System Ready.</div>
              <div className="text-xs">Waiting for command inputs...</div>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-lg p-3 text-sm leading-relaxed shadow-sm border
                    ${isUser
                      ? "bg-[#1f6feb] border-[#1f6feb] text-white"
                      : "bg-[#21262d] border-[#30363d] text-[#c9d1d9]"
                    }`}
                >
                  {!isUser && <div className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1 flex items-center gap-1"><Icons.Robot /> System</div>}
                  <div className="whitespace-pre-wrap">{m.parts[0].text}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-3 text-xs text-[#8b949e]">
                Processing request...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#30363d] bg-[#161b22]">
          <form onSubmit={handleSend} className="relative">
            <input
              className="w-full bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-md pl-4 pr-10 py-3 focus:outline-none focus:border-[#0db7ed] focus:ring-1 focus:ring-[#0db7ed] transition-all placeholder-[#484f58]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a command..."
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 p-1.5 text-[#8b949e] hover:text-white disabled:opacity-30 transition-colors"
            >
              <Icons.Send />
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0d10] relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-3 left-3 z-10 p-2 bg-[#1f6feb] text-white rounded hover:bg-[#388bfd] transition-colors shadow-lg border border-transparent hover:border-white/20"
        >
          <Icons.SidebarLeft />
        </button>

        <div className="h-14 flex items-center justify-end px-6 border-b border-[#30363d] bg-[#0d1117]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f6feb]/10 border border-[#1f6feb]/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono text-[#58a6ff]">DAEMON: ACTIVE</span>
            </div>
            <div className="text-xs text-[#8b949e] font-mono">v24.0.6</div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest">Live System Logs</h2>
          </div>

          <div className="flex-1 border border-[#30363d] rounded-lg overflow-hidden bg-black shadow-2xl relative group">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-[#1f6feb]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-full w-full">
              <Terminal />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
