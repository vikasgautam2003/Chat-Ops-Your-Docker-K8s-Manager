// "use client";
// import { useState, useEffect, useRef } from "react";
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// export default function Home() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("Disconnected 🔴");

//   const mcpClientRef = useRef(null);

//   // useEffect(() => {
//   //   async function connectToDocker() {
//   //     try {
//   //       const transport = new SSEClientTransport({
//   //         url: "http://localhost:3001/sse",
//   //       });

//   //       const client = new Client(
//   //         { name: "srank-frontend", version: "1.0.0" },
//   //         { capabilities: { tools: {} } }
//   //       );

//   //       await client.connect(transport);
//   //       mcpClientRef.current = client;
//   //       setStatus("Connected to Docker 🟢");
//   //     } catch (err) {
//   //       setStatus("Connection Failed ❌ (Is Server running?)");
//   //     }
//   //   }
//   //   connectToDocker();
//   // }, []);


//   const isConnecting = useRef(false);
// useEffect(() => {
//   let activeClient = null;

//   async function connectToDocker() {
//     if (isConnecting.current) return;
//     isConnecting.current = true;

//     try {
//       console.log("🔌 Connecting to MCP server...");

//       const transport = new SSEClientTransport({
//         url: "/mcp/sse", // ✅ MUST be relative
//       });

//       const client = new Client(
//         { name: "srank-frontend", version: "1.0.0" },
//         { capabilities: { tools: {} } }
//       );

//       await client.connect(transport);

//       activeClient = client;
//       mcpClientRef.current = client;
//       setStatus("Connected to Docker 🟢");
//       console.log("✅ MCP Connected");
//     } catch (err) {
//       console.error("❌ MCP Connection failed:", err);
//       isConnecting.current = false;
//     }
//   }

//   connectToDocker();

//   return () => {
//     if (activeClient) {
//       activeClient.close();
//       isConnecting.current = false;
//     }
//   };
// }, []);




//   async function handleSend(e) {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMsg = { role: "user", parts: [{ text: input }] };
//     const newHistory = [...messages, userMsg];
//     setMessages(newHistory);
//     setInput("");
//     setLoading(true);

//     try {
//       let toolDefs = [];
//       if (mcpClientRef.current) {
//         const toolsList = await mcpClientRef.current.listTools();
//         toolDefs = toolsList.tools.map(t => ({
//           name: t.name,
//           description: t.description,
//           parameters: t.inputSchema,
//         }));
//       }

//       const res1 = await fetch("/api/chat", {
//         method: "POST",
//         body: JSON.stringify({
//           history: newHistory,
//           message: input,
//           tools: toolDefs,
//         }),
//       });
//       const data1 = await res1.json();

//       if (data1.toolRequest) {
//         const { name, args } = data1.toolRequest;

//         setMessages(prev => [
//           ...prev,
//           {
//             role: "system",
//             parts: [{ text: `🛠️ Executing tool: ${name}...` }],
//           },
//         ]);

//         const toolResult = await mcpClientRef.current.callTool({
//           name,
//           arguments: args,
//         });
//         const output = toolResult.content[0].text;

//         const toolResponseMsg = {
//           functionResponse: {
//             name: name,
//             response: { result: output },
//           },
//         };

//         const res2 = await fetch("/api/chat", {
//           method: "POST",
//           body: JSON.stringify({
//             history: [...newHistory],
//             message: toolResponseMsg,
//           }),
//         });
//         const data2 = await res2.json();

//         setMessages(prev => [
//           ...prev,
//           { role: "model", parts: [{ text: data2.text }] },
//         ]);
//       } else {
//         setMessages(prev => [
//           ...prev,
//           { role: "model", parts: [{ text: data1.text }] },
//         ]);
//       }
//     } catch (err) {
//       alert("Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
//       <div className="w-full max-w-2xl flex justify-between items-center mb-4 mt-10">
//         <h1 className="text-2xl font-bold">Srank Ops 🐳</h1>
//         <span className="text-sm font-mono border px-2 py-1 rounded border-gray-600">
//           {status}
//         </span>
//       </div>

//       <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 mb-20 overflow-y-auto h-[60vh]">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`mb-4 p-3 rounded-lg max-w-[85%] ${
//               msg.role === "user"
//                 ? "bg-blue-600 ml-auto"
//                 : msg.role === "system"
//                 ? "bg-yellow-900 mx-auto text-sm text-center"
//                 : "bg-gray-700 mr-auto"
//             }`}
//           >
//             {msg.parts[0].text}
//           </div>
//         ))}
//         {loading && (
//           <div className="text-gray-400 animate-pulse">Thinking...</div>
//         )}
//       </div>

//       <form
//         onSubmit={handleSend}
//         className="fixed bottom-0 w-full max-w-2xl bg-gray-900 p-4 border-t border-gray-700"
//       >
//         <input
//           className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
//           placeholder="Commands..."
//           value={input}
//           onChange={e => setInput(e.target.value)}
//         />
//       </form>
//     </div>
//   );
// }









// "use client";
// import { useState } from "react";

// export default function Home() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [status] = useState("Ready 🟢");

//   async function handleSend(e) {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMsg = { role: "user", parts: [{ text: input }] };
//     const history = [...messages, userMsg];
//     setMessages(history);
//     setInput("");
//     setLoading(true);

//     try {
//       // 1. Ask Gemini what to do
//       const res1 = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           history,
//           message: input,
//           tools: [
//             {
//               name: "list_containers",
//               description: "List running Docker containers",
//               parameters: {},
//             },
//           ],
//         }),
//       });

//       const data1 = await res1.json();

//       // 2. If Gemini wants a tool → execute it
//       if (data1.toolRequest) {
//         const { name } = data1.toolRequest;

//         setMessages((p) => [
//           ...p,
//           {
//             role: "system",
//             parts: [{ text: `🛠️ Running tool: ${name}` }],
//           },
//         ]);

//         const toolRes = await fetch(
//           "http://localhost:3001/tools/list_containers",
//           { method: "POST" }
//         );
//         const toolData = await toolRes.json();

//         // 3. Send tool result back to Gemini
//         const res2 = await fetch("/api/chat", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             history,
//             message: {
//               functionResponse: {
//                 name,
//                 response: { result: JSON.stringify(toolData.result) },
//               },
//             },
//           }),
//         });

//         const data2 = await res2.json();

//         setMessages((p) => [
//           ...p,
//           { role: "model", parts: [{ text: data2.text }] },
//         ]);
//       } else {
//         setMessages((p) => [
//           ...p,
//           { role: "model", parts: [{ text: data1.text }] },
//         ]);
//       }
//     } catch (err) {
//       alert("Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
//       <div className="w-full max-w-2xl flex justify-between items-center mb-4 mt-10">
//         <h1 className="text-2xl font-bold">Srank Ops 🐳</h1>
//         <span className="text-sm border px-2 py-1 rounded border-gray-600">
//           {status}
//         </span>
//       </div>

//       <div className="w-full max-w-2xl bg-gray-800 p-6 mb-20 h-[60vh] overflow-y-auto rounded">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`mb-3 p-3 rounded ${
//               m.role === "user"
//                 ? "bg-blue-600 ml-auto"
//                 : m.role === "system"
//                 ? "bg-yellow-900 text-center"
//                 : "bg-gray-700"
//             }`}
//           >
//             {m.parts[0].text}
//           </div>
//         ))}
//         {loading && <div className="text-gray-400">Thinking…</div>}
//       </div>

//       <form
//         onSubmit={handleSend}
//         className="fixed bottom-0 w-full max-w-2xl p-4 bg-gray-900 border-t border-gray-700"
//       >
//         <input
//           className="w-full p-3 rounded bg-gray-800 border border-gray-600"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Commands…"
//         />
//       </form>
//     </div>
//   );
// }





"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", parts: [{ text: input }] };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res1 = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          message: input,
          tools: [
            {
              name: "list_containers",
              description: "List running Docker containers",
              parameters: {},
            },
          ],
        }),
      });

      const data1 = await res1.json();

      if (data1.toolRequest) {
        const toolRes = await fetch(
          "http://localhost:3001/tools/list_containers",
          { method: "POST" }
        );
        const toolData = await toolRes.json();

        const res2 = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            history,
            message: [
              {
                functionResponse: {
                  name: data1.toolRequest.name,
                  response: { result: JSON.stringify(toolData.result) },
                },
              },
            ],
          }),
        });

        const data2 = await res2.json();

        setMessages((p) => [
          ...p,
          { role: "model", parts: [{ text: data2.text }] },
        ]);
      } else {
        setMessages((p) => [
          ...p,
          { role: "model", parts: [{ text: data1.text }] },
        ]);
      }
    } catch (e) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 mb-20 h-[60vh] overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 p-3 rounded ${
              m.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
            }`}
          >
            {m.parts[0].text}
          </div>
        ))}
        {loading && <div className="text-gray-400">Thinking...</div>}
      </div>

      <form
        onSubmit={handleSend}
        className="fixed bottom-0 w-full max-w-2xl p-4 bg-gray-900 border-t border-gray-700"
      >
        <input
          className="w-full p-3 rounded bg-gray-800 border border-gray-600"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Commands..."
        />
      </form>
    </div>
  );
}
