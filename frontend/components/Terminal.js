







// "use client";
// import { useEffect, useRef } from "react";
// import "xterm/css/xterm.css";

// export default function TerminalClient() {
//   const terminalRef = useRef(null);

//   useEffect(() => {
//     let term;
//     let ws;

//     async function init() {
//       const { Terminal } = await import("xterm");
//       const { FitAddon } = await import("xterm-addon-fit");

//       term = new Terminal({
//         cursorBlink: true,
//         theme: {
//           background: "#0f141b",
//           foreground: "#10b981",
//         },
//         fontFamily: 'Menlo, Monaco, "Courier New", monospace',
//         fontSize: 14,
//       });

//       const fitAddon = new FitAddon();
//       term.loadAddon(fitAddon);
//       term.open(terminalRef.current);
//       fitAddon.fit();

//       term.writeln("Connecting to System Stream...");

//       ws = new WebSocket("ws://localhost:3001");

//       ws.onopen = () => {
//         term.writeln("\x1b[32m✔ Connected to Log Stream\x1b[0m");
//       };

//       ws.onmessage = (event) => {
//         term.writeln(event.data);
//       };

//       ws.onclose = () => {
//         term.writeln("\x1b[31m❌ Connection Lost\x1b[0m");
//       };

//       // Resize on window change
//       window.addEventListener("resize", fitAddon.fit);
//     }

//     if (terminalRef.current) init();

//     return () => {
//       ws?.close();
//       term?.dispose();
//     };
//   }, []);

//   return (
//     <div
//       ref={terminalRef}
//       className="w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-xl"
//     />
//   );
// }













"use client";
import { useEffect, useRef } from "react";
import "xterm/css/xterm.css";

export default function TerminalClient() {
  const terminalRef = useRef(null);

  useEffect(() => {
    let term;
    let ws;

    async function init() {
      const { Terminal } = await import("xterm");
      const { FitAddon } = await import("xterm-addon-fit");

      term = new Terminal({
        cursorBlink: true,
        cursorStyle: "block",
        scrollback: 3000,
        theme: {
          background: "#0b0f14",
          foreground: "#a7f3d0",
          cursor: "#10b981",
          selection: "#1f2937",
        },
        fontFamily:
          'JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace',
        fontSize: 14,
        lineHeight: 1.4,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln("\x1b[90m➜ Initializing terminal...\x1b[0m");
      term.writeln("\x1b[36mConnecting to system log stream...\x1b[0m");

      ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);


      ws.onopen = () => {
        term.writeln("\x1b[32m✔ Connected to Log Stream\x1b[0m");
      };

      ws.onmessage = (event) => {
        term.writeln(event.data);
      };

      ws.onclose = () => {
        term.writeln("\x1b[31m✖ Connection Lost\x1b[0m");
      };

      window.addEventListener("resize", fitAddon.fit);
    }

    if (terminalRef.current) init();

    return () => {
      ws && ws.close();
      term && term.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-[#0b0f14]">
     
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] border-b border-gray-800">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-4 text-sm text-gray-400 font-mono">
          system-log-terminal
        </span>
      </div>

   
      <div
        ref={terminalRef}
        className="flex-1 overflow-hidden [&_.xterm-viewport]:bg-transparent [&_.xterm-screen]:p-2"
      />
    </div>
  );
}
