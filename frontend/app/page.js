
























// "use client";
// import { useState, useEffect } from "react";
// import Terminal from "@/components/Terminal";
// import ChatInterface from "@/components/ChatInterface";
// import ResultBoard from "@/components/ResultBoard";
// import ImageStore from "@/components/ImageStore";
// import { useChat } from "@/hooks/useChat";



// const Icons = {
//   Terminal: () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <polyline points="4 17 10 11 4 5" />
//       <line x1="12" y1="19" x2="20" y2="19" />
//     </svg>
//   ),
//   Board: () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <rect width="18" height="18" x="3" y="3" rx="2" />
//       <path d="M3 9h18" />
//       <path d="M9 21V9" />
//     </svg>
//   ),
//   Sidebar: () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <rect width="18" height="18" x="3" y="3" rx="2" />
//       <line x1="9" y1="3" x2="9" y2="21" />
//     </svg>
//   ),
// };

// export default function Home() {
//   const {
//     messages,
//     loading,
//     sendMessage,
//     activeResult,
//     storeData,
//     isStoreOpen,
//     setIsStoreOpen,
//   } = useChat();

   




//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [viewMode, setViewMode] = useState("terminal");



//   useEffect(() => {
//     if (activeResult) setViewMode("board");
//   }, [activeResult]);

//   const handleInstallImage = (imageName) => {
//     setIsStoreOpen(false);
//     sendMessage(`System: User selected '${imageName}'. Pull this image now.`);
//   };

//   return (
//     <div className="flex h-screen w-full bg-[#0b0d10] text-[#c9d1d9] overflow-hidden">
//       <ImageStore
//         isOpen={isStoreOpen}
//         onClose={() => setIsStoreOpen(false)}
//         data={storeData}
//         onInstall={handleInstallImage}
//       />

//       <ChatInterface
//         messages={messages}
//         loading={loading}
//         onSendMessage={sendMessage}
//         isOpen={isSidebarOpen}
//       />

//       <main className="flex-1 flex flex-col min-w-0 relative bg-[#0b0d10]">
//         {/* Sidebar toggle */}
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="absolute top-4 left-4 z-20 p-2 rounded-full
//             bg-white/5 hover:bg-white/10 backdrop-blur
//             text-white transition shadow-lg"
//         >
//           <Icons.Sidebar />
//         </button>

//         {/* Top control bar */}
//         <div className="h-14 flex items-center justify-end px-6 gap-4 border-b border-white/5">
//           <div className="flex bg-white/5 rounded-full p-1">
//             <button
//               onClick={() => setViewMode("terminal")}
//               className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition
//                 ${viewMode === "terminal"
//                   ? "bg-white/10 text-white"
//                   : "text-white/50 hover:text-white"}`}
//             >
//               <Icons.Terminal /> Terminal
//             </button>
//             <button
//               onClick={() => setViewMode("board")}
//               className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition
//                 ${viewMode === "board"
//                   ? "bg-[#1f6feb] text-white"
//                   : "text-white/50 hover:text-white"}`}
//             >
//               <Icons.Board /> Results
//             </button>
//           </div>

//           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-mono">
//             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//             ACTIVE
//           </div>
//         </div>

//         {/* MAIN CANVAS — FULL SPACE */}
//         <div className="flex-1 overflow-hidden">
//           <div className="h-full w-full relative">
//             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
//             <div className="h-full w-full">
//               {viewMode === "terminal" ? (
//                 <Terminal />
//               ) : (
//                 <ResultBoard result={activeResult} />
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
     

//     </div>
//   );
// }










// import Link from "next/link";
// import { ArrowRight, Terminal, Shield, Cpu, Activity, Globe, Eye } from "lucide-react";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-200 overflow-x-hidden">
      
//       <div className="fixed inset-0 z-0 pointer-events-none">
//         <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-slate-800 to-black rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>

//         <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-gradient-to-tr from-teal-200 via-orange-100 to-rose-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>

//         <div className="absolute -bottom-40 left-1/2 w-[800px] h-[600px] bg-gradient-to-t from-slate-100 to-transparent rounded-full transform -translate-x-1/2 filter blur-3xl opacity-50"></div>

//         <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1440 900" fill="none">
//           <path d="M-100 600 C 200 600, 400 200, 800 100 S 1600 400, 1600 200" stroke="#334155" strokeWidth="1" />
//           <path d="M-100 800 C 300 800, 500 500, 900 400 S 1500 700, 1700 300" stroke="#94a3b8" strokeWidth="1" strokeDasharray="10 10" />
//         </svg>
//       </div>

//       <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
//             <Terminal size={16} />
//           </div>
//           <span className="text-xl font-bold tracking-tight">OpsChat</span>
//         </div>

//         <Link
//           href="/ops"
//           className="group inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition"
//         >
//           Get Started
//           <span className="ml-2 opacity-50 font-mono text-xs group-hover:opacity-100">/ops</span>
//         </Link>
//       </nav>

//       <main className="relative z-10 w-full">

//         <section className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
//           <div className="inline-block mb-6 px-4 py-1.5 rounded-full border bg-white/50 text-xs text-slate-500 uppercase">
//             Natural Language DevOps Interface
//           </div>

//           <h1 className="text-6xl md:text-7xl font-serif leading-tight mb-8">
//             The DevOps interface that <br className="hidden md:block" /> works for you.
//           </h1>

//           <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
//             Interact with Docker and Kubernetes using plain English. No CLI commands — just safe execution.
//           </p>

//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Link
//               href="/ops"
//               className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-lg hover:scale-105 transition"
//             >
//               Start Chatting
//               <span className="font-mono text-white/40 text-sm">/ops</span>
//             </Link>

//             <Link
//               href="#features"
//               className="px-8 py-4 bg-white border rounded-full text-lg hover:bg-slate-50"
//             >
//               How it works
//             </Link>
//           </div>
//         </section>

//         <section className="max-w-6xl mx-auto px-4 mb-32">
//           <div className="bg-[#0A0A0A] rounded-[3rem] p-12 md:p-24 text-white text-center relative overflow-hidden">
//             <h2 className="text-4xl md:text-5xl font-serif mb-8">
//               Your safety-first infrastructure assistant
//             </h2>

//             <p className="text-slate-400 max-w-3xl mx-auto mb-12">
//               OpsChat translates intent into bounded, read-only infrastructure actions.
//             </p>

//             <div className="grid md:grid-cols-3 gap-6 mt-16">
//               <FeatureHighlight
//                 icon={<Shield className="text-emerald-400" />}
//                 title="Deterministic Safety"
//                 desc="Strict intent routing prevents unsafe operations."
//               />
//               <FeatureHighlight
//                 icon={<Activity className="text-blue-400" />}
//                 title="Health Intelligence"
//                 desc="Human-readable Kubernetes health analysis."
//               />
//               <FeatureHighlight
//                 icon={<Terminal className="text-orange-400" />}
//                 title="Live Logs"
//                 desc="Real-time log streaming via WebSockets."
//               />
//             </div>

//             <div className="mt-16 border-t border-white/10 pt-8">
//               <Link href="/ops" className="inline-flex items-center gap-2 hover:text-slate-300">
//                 Explore Capabilities <ArrowRight size={16} />
//               </Link>
//             </div>
//           </div>
//         </section>

//         <section id="features" className="max-w-6xl mx-auto px-6 mb-32">
//           <div className="grid md:grid-cols-4 gap-8">
//             <DetailCard icon={<Cpu />} title="Isolated Workers" desc="Dedicated Docker & K8s workers." />
//             <DetailCard icon={<Globe />} title="Global Status" desc="Instant system readiness indicators." />
//             <DetailCard icon={<Eye />} title="Presence Detection" desc="Environment availability detection." />
//             <DetailCard icon={<Terminal />} title="No CLI Required" desc="Natural language infrastructure ops." />
//           </div>
//         </section>
//       </main>

//       <footer className="bg-slate-50 border-t">
//         <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-center">
//           <span className="font-bold">OpsChat</span>
//           <span className="text-xs text-slate-400">© 2025 OpsChat</span>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function FeatureHighlight({ icon, title, desc }) {
//   return (
//     <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
//       <div className="mb-4">{icon}</div>
//       <h4 className="text-lg mb-2">{title}</h4>
//       <p className="text-sm text-slate-400">{desc}</p>
//     </div>
//   );
// }

// function DetailCard({ icon, title, desc }) {
//   return (
//     <div className="p-6 rounded-2xl bg-white border shadow-sm hover:shadow-md transition">
//       <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
//         {icon}
//       </div>
//       <h4 className="mb-2">{title}</h4>
//       <p className="text-sm text-slate-500">{desc}</p>
//     </div>
//   );
// }













"use client"


import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Shield, Cpu, Activity, Globe, Eye, X, BookOpen, Zap, Layers, Lock, Play } from "lucide-react";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-200 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-slate-800 to-black rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-gradient-to-tr from-teal-200 via-orange-100 to-rose-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
        <div className="absolute -bottom-40 left-1/2 w-[800px] h-[600px] bg-gradient-to-t from-slate-100 to-transparent rounded-full transform -translate-x-1/2 filter blur-3xl opacity-50"></div>
        
        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M-100 600 C 200 600, 400 200, 800 100 S 1600 400, 1600 200" stroke="#334155" strokeWidth="1" />
           <path d="M-100 800 C 300 800, 500 500, 900 400 S 1500 700, 1700 300" stroke="#94a3b8" strokeWidth="1" strokeDasharray="10 10" />
        </svg>
      </div>

      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
            <Terminal size={16} />
          </div>
          <span className="text-xl font-bold tracking-tight">OpsChat</span>
        </div>
        
        <Link 
          href="/ops" 
          className="group relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white transition-all duration-300 bg-slate-900 rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
        >
          <span>Get Started</span>
          <span className="ml-2 opacity-50 font-mono text-xs group-hover:opacity-100 transition-opacity">/ops</span>
        </Link>
      </nav>

      <main className="relative z-10 w-full">
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-xs font-medium text-slate-500 uppercase tracking-wider">
            Natural Language DevOps Interface
          </div>
          
          <h1 className="text-6xl md:text-7xl font-serif font-medium leading-[1.1] mb-8 text-slate-900">
            The DevOps interface that <br className="hidden md:block" /> works for you.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Interact with Docker and Kubernetes using plain English. 
            No CLI commands, just deterministic, safe, and secure execution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
              href="/ops" 
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-lg font-medium transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
            >
              <span>Start Chatting</span>
              <span className="font-mono text-white/40 text-sm group-hover:text-white/60">/ops</span>
            </Link>
             <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full text-lg font-medium hover:bg-slate-50 transition-colors"
            >
              How it works
            </button>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 mb-32">
          <div className="bg-[#0A0A0A] rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-900/30 blur-[100px] rounded-full pointer-events-none"></div>

            <h2 className="relative z-10 text-4xl md:text-5xl font-serif font-medium mb-8">
              Your safety-first infrastructure assistant
            </h2>
            
            <p className="relative z-10 text-lg text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              What can OpsChat do? Discover a platform that translates natural intent into bounded, 
              read-only operations. From checking pod health to streaming logs, OpsChat removes the 
              cognitive burden of CLI tools.
            </p>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16">
               <FeatureHighlight 
                 icon={<Shield className="w-6 h-6 text-emerald-400" />}
                 title="Deterministic Safety"
                 desc="Intent-to-action routing with strict constraints prevents unsafe operations."
               />
               <FeatureHighlight 
                 icon={<Activity className="w-6 h-6 text-blue-400" />}
                 title="Health Intelligence"
                 desc="Kubernetes health analysis with human-readable explanations."
               />
               <FeatureHighlight 
                 icon={<Terminal className="w-6 h-6 text-orange-400" />}
                 title="Live Logs"
                 desc="Real-time terminal-style log streaming via WebSockets."
               />
            </div>
            
             <div className="mt-16 pt-8 border-t border-white/10">
                <Link href="/ops" className="text-white hover:text-slate-300 transition-colors inline-flex items-center gap-2">
                   Explore Capabilities <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-6 mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-slate-200 pb-8">
            <h3 className="text-3xl font-serif text-slate-900">Designed for clarity.</h3>
            <p className="text-slate-500 mb-1">Local execution. Global readiness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <DetailCard 
               icon={<Cpu />}
               title="Isolated Workers"
               desc="Dedicated worker architecture for Docker and K8s ensures process isolation."
            />
            <DetailCard 
               icon={<Globe />}
               title="Global Status"
               desc="System status indicators show execution readiness at a glance."
            />
            <DetailCard 
               icon={<Eye />}
               title="Presence Detection"
               desc="Local sensors detect environment availability to prevent silent failures."
            />
            <DetailCard 
               icon={<Terminal />}
               title="No CLI Required"
               desc="Interact with your infrastructure using pure natural language."
            />
          </div>
        </section>
      </main>

      <footer className="w-full bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white">
                <Terminal size={12} />
              </div>
              <span className="font-bold text-slate-900">OpsChat</span>
           </div>
           
           <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
              <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
              <a href="#" className="hover:text-slate-900 transition-colors">License</a>
           </div>

           <div className="text-xs text-slate-400">
              © 2025 OpsChat. Local Environment Only.
           </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-100 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
                    <BookOpen size={16} />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">Documentation</h3>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Scope</p>
                  <h4 className="text-2xl font-serif text-slate-900 leading-tight">
                    Chat-Driven <br/> DevOps Operations
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed mt-4">
                    A technical breakdown of how OpsChat maintains safety while providing a seamless user experience.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                 <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="rotate-180" size={14} /> Back to Landing
                </button>
              </div>
            </div>

            <div className="w-full md:w-2/3 p-8 md:p-12 bg-white">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h2 className="text-2xl font-serif text-slate-900 mb-2">System Architecture</h2>
                    <p className="text-slate-500 text-sm">Version 1.0 • Read-Only Operations</p>
                 </div>
                 <button 
                   onClick={() => setIsModalOpen(false)} 
                   className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="space-y-10">
                <DocItem 
                  icon={<Terminal className="text-indigo-600" />}
                  title="Zero Command Knowledge"
                  content="Developers never write Docker or kubectl commands. OpsChat handles execution logic internally and presents results in a clean, human-readable format."
                />
                
                <DocItem 
                  icon={<Shield className="text-emerald-600" />}
                  title="Deterministic Mapping"
                  content="Every user message is classified and mapped to a single, bounded operation, preventing ambiguous or unsafe infrastructure actions."
                />

                <DocItem 
                  icon={<Layers className="text-blue-600" />}
                  title="Isolated Workers"
                  content="Docker and Kubernetes operations run in separate workers, ensuring failures or delays in one domain never affect the other."
                />

                <DocItem 
                  icon={<Play className="text-orange-600" />}
                  title="Real-Time Feedback"
                  content="Users see live, terminal-style logs that show exactly what the system is doing, building trust without requiring CLI knowledge."
                />
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                <Link 
                   href="/ops"
                   className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Initialize Session <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureHighlight({ icon, title, desc }) {
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
      <div className="mb-4">{icon}</div>
      <h4 className="text-lg font-medium text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function DetailCard({ icon, title, desc }) {
   return (
      <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
         <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            {icon}
         </div>
         <h4 className="font-medium text-slate-900 mb-2">{title}</h4>
         <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
   )
}

function DocItem({ icon, title, content }) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-lg font-medium text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
          {content}
        </p>
      </div>
    </div>
  )
}