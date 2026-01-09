
import React from 'react';
import { Match, Team, Tournament } from '../../types';
import { Volleyball } from 'lucide-react';

interface Props {
  match: Match | null;
  home: Team | null;
  away: Team | null;
  tournament: Tournament | null;
}

const MiniBug: React.FC<Props> = ({ match, home, away, tournament }) => {
  if (!match || !home || !away || !tournament) return null;
  
  const current = match.scores[match.currentSet - 1] || { home: 0, away: 0 };
  
  return (
    <div className="fixed top-6 left-6 flex items-center bg-slate-950/95 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 shadow-2xl z-50 animate-slide-right select-none h-9">
      <div className="h-full w-9 bg-blue-600 flex items-center justify-center border-r border-white/10 p-1.5">
        <img src={tournament.logo} className="h-full w-full object-contain" alt="Logo" />
      </div>

      <div className="px-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {match.servingSide === 'home' && <Volleyball size={10} className="text-amber-400" />}
          <div className="flex flex-col items-center">
            <span className="font-oswald font-bold text-white text-[10px] leading-none">{home.shortName}</span>
            <span className="text-blue-400 font-black text-[9px] leading-none mt-0.5">{match.setsWon.home}</span>
          </div>
        </div>

        <div className="bg-white/5 px-2 py-0.5 rounded border border-white/5 flex gap-1">
          <span className="text-white font-oswald font-bold text-sm w-4 text-center">{current.home}</span>
          <span className="text-white/20 font-bold text-[10px]">:</span>
          <span className="text-white font-oswald font-bold text-sm w-4 text-center">{current.away}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex flex-col items-center">
            <span className="font-oswald font-bold text-white text-[10px] leading-none">{away.shortName}</span>
            <span className="text-blue-400 font-black text-[9px] leading-none mt-0.5">{match.setsWon.away}</span>
          </div>
          {match.servingSide === 'away' && <Volleyball size={10} className="text-amber-400" />}
        </div>
      </div>

      <div className="h-full px-2 bg-blue-600/30 flex flex-col items-center justify-center border-l border-white/10">
        <span className="text-[5px] font-black text-white/50 leading-none mb-0.5">SET</span>
        <span className="text-xs font-oswald font-bold text-white leading-none">{match.currentSet}</span>
      </div>
    </div>
  );
};

export default MiniBug;
