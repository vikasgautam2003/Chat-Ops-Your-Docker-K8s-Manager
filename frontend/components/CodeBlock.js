// "use client";
// import { useState } from "react";

// export default function CodeBlock({ code, language = "dockerfile", filename = "Dockerfile" }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden my-4 shadow-xl">
     
//       <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
//         <div className="flex items-center gap-2">
//            <div className="flex gap-1.5">
//              <span className="w-3 h-3 rounded-full bg-[#fa7970]"></span>
//              <span className="w-3 h-3 rounded-full bg-[#faa356]"></span>
//              <span className="w-3 h-3 rounded-full bg-[#7ce38b]"></span>
//            </div>
//            <span className="ml-3 text-xs font-mono text-[#8b949e]">{filename}</span>
//         </div>
//         <button 
//           onClick={handleCopy}
//           className={`text-xs font-bold transition-all px-2 py-1 rounded ${
//              copied ? "text-green-400 bg-green-400/10" : "text-[#8b949e] hover:text-white hover:bg-[#30363d]"
//           }`}
//         >
//           {copied ? "COPIED!" : "COPY"}
//         </button>
//       </div>
      
//       {/* Code Area */}
//       <div className="p-4 overflow-x-auto bg-[#0d1117]">
//         <pre className="font-mono text-sm text-[#c9d1d9] whitespace-pre leading-relaxed">
//           <code>{code}</code>
//         </pre>
//       </div>
//     </div>
//   );
// }












"use client";
import { useState } from "react";

export default function CodeBlock({ files }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!files || files.length === 0) return null;

  const activeFile = files[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden my-4 shadow-xl flex flex-col">
      <div className="flex items-center justify-between px-4 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 mr-4 py-3 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#fa7970]"></span>
            <span className="w-3 h-3 rounded-full bg-[#faa356]"></span>
            <span className="w-3 h-3 rounded-full bg-[#7ce38b]"></span>
          </div>

          <div className="flex">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 py-3 text-xs font-mono transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === index
                    ? "text-white border-[#f78166] bg-[#0d1117]"
                    : "text-[#8b949e] border-transparent hover:text-[#c9d1d9] hover:bg-[#21262d]"
                }`}
              >
                {file.filename}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`ml-2 text-xs font-bold transition-all px-2 py-1 rounded shrink-0 ${
            copied
              ? "text-green-400 bg-green-400/10"
              : "text-[#8b949e] hover:text-white hover:bg-[#30363d]"
          }`}
        >
          {copied ? "COPIED!" : "COPY"}
        </button>
      </div>

      <div className="p-4 overflow-x-auto bg-[#0d1117]">
        <pre className="font-mono text-sm text-[#c9d1d9] whitespace-pre leading-relaxed">
          <code>{activeFile.code}</code>
        </pre>
      </div>
    </div>
  );
}
