
import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface Props {
  isActive: boolean;
}

const ReplayOverlay: React.FC<Props> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center animate-fade-in pointer-events-none">
       {/* Scanner lines */}
       <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px]">
          <div className="absolute top-0 w-full h-1 bg-white/50 animate-scanner shadow-[0_0_20px_white]" />
       </div>

       <div className="relative flex flex-col items-center">
          <div className="bg-amber-400 text-slate-950 px-10 py-3 rounded-2xl flex items-center gap-4 shadow-2xl border-4 border-slate-950 animate-pulse">
             <RefreshCcw size={32} className="animate-spin" style={{ animationDuration: '3s' }} />
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">PRO REPLAY</span>
                <span className="font-oswald text-4xl font-black italic uppercase leading-none">INSTANTANEO</span>
             </div>
          </div>
       </div>

       <div className="absolute top-20 right-20 flex flex-col items-end opacity-40">
          <div className="w-40 h-1 bg-white mb-2" />
          <span className="text-white font-black italic text-xs tracking-widest">ANALIZANDO JUGADA</span>
       </div>

       <style>{`
          @keyframes scanner { 
             0% { top: 0; } 
             50% { top: 100%; } 
             100% { top: 0; } 
          }
          .animate-scanner { animation: scanner 4s ease-in-out infinite; }
       `}</style>
    </div>
  );
};

export default ReplayOverlay;
