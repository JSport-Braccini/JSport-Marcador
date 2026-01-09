
import React, { useEffect, useState } from 'react';
import { Match, Team, Tournament, Player } from '../../types';
import { Volleyball } from 'lucide-react';

interface Props {
  match: Match | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  tournament: Tournament | null;
}

const VNLMainScoreboard: React.FC<Props> = ({ match, homeTeam, awayTeam, tournament }) => {
  const [internalShow, setInternalShow] = useState(false);

  useEffect(() => {
    if (match?.showServerOverlay) {
      setInternalShow(true);
    } else {
      setInternalShow(false);
    }
  }, [match?.showServerOverlay]);

  if (!match || !homeTeam || !awayTeam || !tournament) return null;
  
  const currentScores = match.scores[match.currentSet - 1] || { home: 0, away: 0 };
  const targetScore = match.currentSet === 5 ? 14 : 24;
  const isSetPoint = (currentScores.home >= targetScore && currentScores.home > currentScores.away) || 
                     (currentScores.away >= targetScore && currentScores.away > currentScores.home);

  const servingTeam = match.servingSide === 'home' ? homeTeam : awayTeam;
  const servingPlayer = servingTeam?.players.find(p => p.id === match.servingPlayerId);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 animate-fade-in pointer-events-none w-full max-w-5xl">
      
      {/* Marcador Fly-out para el sacador - Pro Style */}
      <div className={`absolute left-0 bottom-20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${internalShow && servingPlayer ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        {servingPlayer && (
          <div className="flex items-center bg-slate-950/95 backdrop-blur-2xl border-y border-r border-white/10 rounded-r-[2rem] p-5 gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[6px] border-amber-400">
            <div className="relative">
              <img src={servingPlayer.image} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10 shadow-xl" />
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">#{servingPlayer.number}</div>
            </div>
            <div className="pr-12">
               <div className="flex items-center gap-2 mb-1">
                 <Volleyball size={12} className="text-amber-400 animate-spin-slow" />
                 <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">SERVICE</p>
               </div>
               <h4 className="font-oswald text-4xl font-bold text-white uppercase leading-none tracking-tight">{servingPlayer.name}</h4>
               <div className="flex gap-8 mt-4">
                 <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Match Pts</p>
                    <p className="text-xl font-oswald font-bold text-white leading-none">{servingPlayer.stats.points}</p>
                 </div>
                 <div className="w-px h-8 bg-white/5" />
                 <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Aces</p>
                    <p className="text-xl font-oswald font-bold text-amber-400 leading-none">{servingPlayer.stats.aces}</p>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Scoreboard - Refined VNL Style */}
      <div className="flex flex-col items-center">
        {isSetPoint && (
          <div className="bg-amber-400 text-slate-900 px-10 py-1 rounded-t-2xl font-black text-[10px] tracking-[0.5em] uppercase shadow-[0_-5px_15px_rgba(251,191,36,0.3)] border-x border-t border-white/20">
            SET POINT
          </div>
        )}
        
        <div className="flex items-center h-16 bg-slate-950 border-b-[4px] border-blue-600 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] rounded-2xl overflow-hidden text-white min-w-[650px] border border-white/5">
          {/* Logo Section */}
          <div className="h-full px-5 flex items-center bg-blue-900/50 border-r border-white/10">
            <img src={tournament.logo} className="h-8 w-8 object-contain filter brightness-0 invert" />
          </div>

          {/* Home Team */}
          <div className="flex-1 flex items-center justify-end pr-6 gap-4">
            <div className="flex flex-col items-end">
              <span className="font-oswald text-2xl font-bold uppercase tracking-tight">{homeTeam.name}</span>
              {match.servingSide === 'home' && <div className="h-1 w-full bg-amber-400 rounded-full animate-pulse mt-0.5" />}
            </div>
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center p-0.5">
              <img src={homeTeam.logo} className="h-full w-full object-contain" />
            </div>
          </div>

          {/* Sets Won Home */}
          <div className="w-12 h-full flex items-center justify-center bg-blue-900/30 border-l border-white/5">
             <span className="text-2xl font-oswald font-bold text-blue-400">{match.setsWon.home}</span>
          </div>

          {/* Live Score */}
          <div className="w-32 h-full bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center gap-2 border-x border-white/10 shadow-inner">
            <div className="text-4xl font-oswald font-bold w-12 text-center drop-shadow-lg">{currentScores.home}</div>
            <div className="text-xl font-bold opacity-30 h-full flex items-center mb-1">:</div>
            <div className="text-4xl font-oswald font-bold w-12 text-center drop-shadow-lg">{currentScores.away}</div>
          </div>

          {/* Sets Won Away */}
          <div className="w-12 h-full flex items-center justify-center bg-blue-900/30 border-r border-white/5">
             <span className="text-2xl font-oswald font-bold text-blue-400">{match.setsWon.away}</span>
          </div>

          {/* Away Team */}
          <div className="flex-1 flex items-center justify-start pl-6 gap-4">
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center p-0.5">
              <img src={awayTeam.logo} className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-oswald text-2xl font-bold uppercase tracking-tight">{awayTeam.name}</span>
              {match.servingSide === 'away' && <div className="h-1 w-full bg-amber-400 rounded-full animate-pulse mt-0.5" />}
            </div>
          </div>

          {/* Current Set Info */}
          <div className="bg-blue-600 px-6 h-full flex flex-col items-center justify-center border-l border-white/10">
            <span className="text-[8px] uppercase font-black opacity-60 tracking-widest leading-none mb-1">SET</span>
            <span className="text-2xl font-oswald font-bold leading-none">{match.currentSet}</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VNLMainScoreboard;
