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
        theme: {
          background: "#111827",
          foreground: "#10b981",
        },
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln("Connecting to System Stream...");

      ws = new WebSocket("ws://localhost:3001");

      ws.onopen = () => {
        term.writeln("\x1b[32m✔ Connected to Log Stream\x1b[0m");
      };

      ws.onmessage = (event) => {
        term.writeln(event.data);
      };

      ws.onclose = () => {
        term.writeln("\x1b[31m❌ Connection Lost\x1b[0m");
      };
    }

    if (terminalRef.current) {
      init();
    }

    return () => {
      ws?.close();
      term?.dispose();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-xl"
    />
  );
}
