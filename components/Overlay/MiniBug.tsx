
import React from 'react';
import { Match, Team, Tournament } from '../../types';

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
    <div className="fixed top-6 left-6 flex items-stretch h-10 z-50 animate-slide-right select-none">
      {/* Tournament Icon - Square Box */}
      <div className="w-10 bg-blue-600 flex items-center justify-center border-b-2 border-blue-400">
        <img src={tournament.logo} className="h-6 w-6 object-contain filter brightness-0 invert" />
      </div>

      {/* Main Score Strip */}
      <div className="flex items-center bg-slate-950/90 backdrop-blur-md px-4 gap-4 border-b-2 border-white/10">
        {/* Home Team */}
        <div className="flex items-center gap-3">
          <span className="font-oswald font-bold text-white text-base tracking-tighter uppercase">{home.shortName}</span>
          <div className="flex items-center gap-1">
            <span className="text-blue-500 font-oswald font-bold text-lg leading-none">{match.setsWon.home}</span>
            {match.servingSide === 'home' && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse shadow-[0_0_5px_#fbbf24]" />}
          </div>
        </div>

        {/* Live Points Bubble */}
        <div className="bg-white/10 px-3 py-0.5 rounded-lg flex items-center gap-2 border border-white/5">
          <span className="text-white font-oswald font-black text-xl w-6 text-center leading-none">{current.home}</span>
          <span className="text-white/20 font-bold text-xs">:</span>
          <span className="text-white font-oswald font-black text-xl w-6 text-center leading-none">{current.away}</span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {match.servingSide === 'away' && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse shadow-[0_0_5px_#fbbf24]" />}
            <span className="text-blue-500 font-oswald font-bold text-lg leading-none">{match.setsWon.away}</span>
          </div>
          <span className="font-oswald font-bold text-white text-base tracking-tighter uppercase">{away.shortName}</span>
        </div>
      </div>

      {/* Set Marker - Vertical Style */}
      <div className="bg-blue-600 px-3 flex flex-col items-center justify-center border-b-2 border-blue-400 min-w-[40px]">
        <span className="text-[7px] font-black text-white/50 leading-none mb-0.5 tracking-widest">SET</span>
        <span className="text-base font-oswald font-bold text-white leading-none">{match.currentSet}</span>
      </div>
      
      <style>{`
        @keyframes slide-right { from { transform: translateX(-100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-right { animation: slide-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default MiniBug;
