"use client";
import { useState } from "react";

export default function CodeBlock({ code, language = "dockerfile", filename = "Dockerfile" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden my-4 shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
           <div className="flex gap-1.5">
             <span className="w-3 h-3 rounded-full bg-[#fa7970]"></span>
             <span className="w-3 h-3 rounded-full bg-[#faa356]"></span>
             <span className="w-3 h-3 rounded-full bg-[#7ce38b]"></span>
           </div>
           <span className="ml-3 text-xs font-mono text-[#8b949e]">{filename}</span>
        </div>
        <button 
          onClick={handleCopy}
          className={`text-xs font-bold transition-all px-2 py-1 rounded ${
             copied ? "text-green-400 bg-green-400/10" : "text-[#8b949e] hover:text-white hover:bg-[#30363d]"
          }`}
        >
          {copied ? "COPIED!" : "COPY"}
        </button>
      </div>
      
      {/* Code Area */}
      <div className="p-4 overflow-x-auto bg-[#0d1117]">
        <pre className="font-mono text-sm text-[#c9d1d9] whitespace-pre leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}