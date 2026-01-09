
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
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 animate-fade-in pointer-events-none w-full max-w-4xl">
      
      <div className={`absolute left-0 bottom-20 transition-all duration-700 ease-out transform ${internalShow && servingPlayer ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        {servingPlayer && (
          <div className="flex items-center bg-slate-950/95 backdrop-blur-xl border-y border-r border-white/10 rounded-r-3xl p-4 gap-5 shadow-2xl border-l-[4px] border-amber-400">
            <div className="relative">
              <img src={servingPlayer.image} className="w-16 h-16 rounded-xl object-cover border border-white/10" />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px]">#{servingPlayer.number}</div>
            </div>
            <div className="pr-6">
               <div className="flex items-center gap-2 mb-0.5">
                 <Volleyball size={10} className="text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                 <p className="text-[8px] font-black text-amber-400 uppercase tracking-widest">AL SAQUE</p>
               </div>
               <h4 className="font-oswald text-2xl font-bold text-white uppercase leading-none">{servingPlayer.name}</h4>
               <div className="flex gap-4 mt-2">
                 <div><p className="text-[7px] text-slate-500 font-bold uppercase">Puntos Part.</p><p className="text-sm font-oswald font-bold text-white">{servingPlayer.stats.points}</p></div>
                 <div className="w-px h-4 bg-white/10" />
                 <div><p className="text-[7px] text-slate-500 font-bold uppercase">Aces</p><p className="text-sm font-oswald font-bold text-amber-400">{servingPlayer.stats.aces}</p></div>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        {isSetPoint && (
          <div className="bg-amber-400 text-slate-950 px-6 py-1 rounded-t-lg font-black text-[8px] tracking-widest uppercase shadow-lg">
            PUNTO DE SET
          </div>
        )}
        
        <div className="flex items-center h-12 bg-slate-950 shadow-2xl rounded-xl overflow-hidden text-white min-w-[550px] border border-white/10">
          <div className="h-full w-12 flex items-center justify-center bg-blue-900/40 border-r border-white/10 p-2">
            <img src={tournament.logo} className="h-full w-full object-contain" alt="Tournament Logo" />
          </div>

          <div className="flex-1 flex items-center justify-end pr-4 gap-3">
            {match.servingSide === 'home' && <Volleyball size={14} className="text-amber-400 animate-bounce" />}
            <span className="font-oswald text-lg font-bold uppercase tracking-tight">{homeTeam.shortName || homeTeam.name}</span>
            <div className="w-8 h-5 bg-white rounded-sm p-0.5"><img src={homeTeam.logo} className="h-full w-full object-contain" alt="Home Logo" /></div>
          </div>

          <div className="w-8 h-full flex items-center justify-center bg-blue-900/20">
             <span className="text-lg font-oswald font-bold text-blue-400">{match.setsWon.home}</span>
          </div>

          <div className="w-24 h-full bg-blue-700 flex flex-col items-center justify-center border-x border-white/10 shadow-inner">
            <div className="flex items-center gap-1.5">
                <div className="text-2xl font-oswald font-black w-8 text-center">{currentScores.home}</div>
                <div className="text-[8px] font-black opacity-30 italic">VS</div>
                <div className="text-2xl font-oswald font-black w-8 text-center">{currentScores.away}</div>
            </div>
          </div>

          <div className="w-8 h-full flex items-center justify-center bg-blue-900/20">
             <span className="text-lg font-oswald font-bold text-blue-400">{match.setsWon.away}</span>
          </div>

          <div className="flex-1 flex items-center justify-start pl-4 gap-3">
            <div className="w-8 h-5 bg-white rounded-sm p-0.5"><img src={awayTeam.logo} className="h-full w-full object-contain" alt="Away Logo" /></div>
            <span className="font-oswald text-lg font-bold uppercase tracking-tight">{awayTeam.shortName || awayTeam.name}</span>
            {match.servingSide === 'away' && <Volleyball size={14} className="text-amber-400 animate-bounce" />}
          </div>

          <div className="bg-blue-600 px-4 h-full flex flex-col items-center justify-center border-l border-white/10">
            <span className="text-[6px] font-black opacity-60 leading-none">SET</span>
            <span className="text-lg font-oswald font-bold leading-none">{match.currentSet}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VNLMainScoreboard;
