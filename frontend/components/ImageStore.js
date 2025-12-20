"use client";

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

export default function ImageStore({ isOpen, onClose, data, onInstall }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-10 animate-in fade-in duration-200">
      {/* 1. Dark Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose} // Close when clicking outside
      ></div>

      {/* 2. The Holographic Store Container */}
      <div className="relative w-full max-w-5xl h-[80vh] bg-[#0d1117]/90 border border-[#30363d] rounded-xl flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30363d] bg-[#161b22]/50">
           <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                 DOCKER HUB <span className="text-[#1f6feb] text-xs px-2 py-0.5 rounded border border-[#1f6feb]/30 bg-[#1f6feb]/10">REGISTRY</span>
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">Select an image to pull into your local environment.</p>
           </div>
           <button 
             onClick={onClose}
             className="p-2 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-white transition-colors"
           >
             ESC
           </button>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scrollbar-thin scrollbar-thumb-gray-700">
           {data && data.map((img, idx) => (
             <div 
               key={idx} 
               className="group relative flex flex-col justify-between p-5 rounded-lg border border-[#30363d] bg-[#0b0d10] hover:border-[#58a6ff] hover:bg-[#161b22] transition-all duration-200"
             >
                <div>
                   <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-[#c9d1d9] group-hover:text-[#58a6ff] truncate pr-2">
                        {img.name}
                      </h3>
                      {/* Check for 'is_official' flag (Docker Hub API usually returns this) */}
                      {img.is_official && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                           <ShieldIcon /> OFFICIAL
                        </div>
                      )}
                   </div>
                   
                   <p className="text-sm text-[#8b949e] mb-4 line-clamp-2 h-10">
                      {img.description || "No description provided."}
                   </p>

                   <div className="flex items-center gap-4 text-xs text-[#8b949e] mb-6">
                      <div className="flex items-center gap-1 text-yellow-400/80">
                         <StarIcon /> {img.star_count}
                      </div>
                      <div className="bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
                         {img.is_automated ? "Automated" : "Public"}
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => onInstall(img.name)}
                  className="w-full py-2.5 rounded flex items-center justify-center gap-2 font-semibold text-xs bg-[#21262d] text-[#c9d1d9] border border-[#30363d] group-hover:bg-[#238636] group-hover:text-white group-hover:border-[#2ea043] transition-all"
                >
                   <DownloadIcon /> INSTALL IMAGE
                </button>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}