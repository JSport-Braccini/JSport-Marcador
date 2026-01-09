
import React from 'react';
import { Player, Team } from '../../types';
import { Crosshair, ShieldAlert, Zap } from 'lucide-react';

interface Props {
  player: Player;
  team: Team;
}

const PlayerStatsBug: React.FC<Props> = ({ player, team }) => {
  return (
    <div className="fixed bottom-32 right-12 flex items-end animate-slide-left z-40 select-none">
      <div className="bg-slate-950/95 backdrop-blur-2xl border-y border-l border-white/10 rounded-l-3xl p-5 flex gap-6 shadow-2xl border-r-[6px] border-blue-600">
        <div className="relative">
          <img src={player.image} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10" alt={player.name} />
          <div className="absolute -bottom-2 -left-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 border-slate-950">#{player.number}</div>
        </div>
        
        <div className="min-w-[180px]">
           <div className="flex items-center gap-2 mb-1">
              <img src={team.logo} className="h-4 w-6 object-contain bg-white rounded-sm p-0.5" alt="" />
              <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{team.name}</p>
           </div>
           <h4 className="font-oswald text-3xl font-bold text-white uppercase leading-none tracking-tight mb-4">{player.name}</h4>
           
           <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                   <Crosshair size={8} />
                   <span className="text-[7px] font-bold uppercase">Puntos</span>
                </div>
                <span className="text-xl font-oswald font-black text-white leading-none">{player.stats.points}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                   <ShieldAlert size={8} />
                   <span className="text-[7px] font-bold uppercase">Blocks</span>
                </div>
                <span className="text-xl font-oswald font-black text-emerald-400 leading-none">{player.stats.blocks}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                   <Zap size={8} />
                   <span className="text-[7px] font-bold uppercase">Aces</span>
                </div>
                <span className="text-xl font-oswald font-black text-amber-400 leading-none">{player.stats.aces}</span>
              </div>
           </div>
        </div>
      </div>
      <style>{`
        @keyframes slide-left { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-left { animation: slide-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default PlayerStatsBug;
