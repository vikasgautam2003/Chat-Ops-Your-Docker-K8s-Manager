"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownModal({ open, onClose, content }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="w-full max-w-3xl max-h-[85vh] bg-[#0d1424] border border-slate-800 rounded-xl shadow-xl flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">
            AI Response
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
