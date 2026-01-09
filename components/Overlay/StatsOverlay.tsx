
import React from 'react';
import { Match, Team, Player } from '../../types';
import { Activity, Star, LayoutGrid, ChevronRight, X } from 'lucide-react';

interface Props {
  match: Match;
  home: Team;
  away: Team;
  view?: 'MATCH_STATS' | 'SET_STATS' | 'ROTATION';
}

const StatsOverlay: React.FC<Props> = ({ match, home, away, view = 'MATCH_STATS' }) => {
  const getBestPlayer = (team: Team) => {
    return team.players.length > 0 ? [...team.players].sort((a, b) => b.stats.points - a.stats.points)[0] : null;
  };

  const bestHome = getBestPlayer(home);
  const bestAway = getBestPlayer(away);

  const StatBar = ({ label, hVal, aVal }: { label: string, hVal: number, aVal: number }) => {
    const total = hVal + aVal || 1;
    const hPerc = (hVal / total) * 100;
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-end px-2">
          <span className="font-oswald text-2xl font-bold text-white">{hVal}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</span>
          <span className="font-oswald text-2xl font-bold text-white">{aVal}</span>
        </div>
        <div className="flex h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${hPerc}%` }} />
          <div className="bg-amber-400 h-full rounded-full transition-all duration-1000 ml-auto" style={{ width: `${100 - hPerc}%` }} />
        </div>
      </div>
    );
  };

  const currentSetScore = match.scores[match.currentSet - 1] || { home: 0, away: 0 };

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[850px] bg-slate-950/95 backdrop-blur-3xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden animate-fade-in z-[60] flex flex-col select-none">
      
      {/* Dynamic Header based on view */}
      <div className={`p-6 flex justify-between items-center border-b border-white/10 ${view === 'MATCH_STATS' ? 'bg-blue-900/20' : view === 'SET_STATS' ? 'bg-amber-900/10' : 'bg-emerald-900/10'}`}>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-xl shadow-lg"><img src={home.logo} className="h-6 w-10 object-contain" /></div>
          <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-tight">{home.shortName}</h2>
        </div>
        
        <div className="flex flex-col items-center">
           <div className="px-4 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">
             {view === 'MATCH_STATS' ? 'MATCH STATISTICS' : view === 'SET_STATS' ? `SET ${match.currentSet} STATISTICS` : 'COURT ROTATIONS'}
           </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-tight">{away.shortName}</h2>
          <div className="p-2 bg-white rounded-xl shadow-lg"><img src={away.logo} className="h-6 w-10 object-contain" /></div>
        </div>
      </div>

      <div className="p-10">
        {view === 'MATCH_STATS' && (
          <div className="grid grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <StatBar label="Match Points" hVal={home.players.reduce((a,b) => a + b.stats.points, 0)} aVal={away.players.reduce((a,b) => a + b.stats.points, 0)} />
              <StatBar label="Aces" hVal={home.players.reduce((a,b) => a + b.stats.aces, 0)} aVal={away.players.reduce((a,b) => a + b.stats.aces, 0)} />
              <StatBar label="Blocks" hVal={home.players.reduce((a,b) => a + b.stats.blocks, 0)} aVal={away.players.reduce((a,b) => a + b.stats.blocks, 0)} />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Match Top Scorer</p>
              {[bestHome, bestAway].map((p, i) => p && (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <img src={p.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div className="flex-1">
                    <p className="text-lg font-oswald font-bold text-white leading-none">#{p.number} {p.name}</p>
                    <p className="text-[9px] font-black text-blue-400 mt-1 uppercase">{i === 0 ? home.shortName : away.shortName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-oswald font-black text-amber-400">{p.stats.points}</p>
                    <p className="text-[7px] font-bold text-slate-500 uppercase">PTS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'SET_STATS' && (
          <div className="flex flex-col gap-10">
             <div className="flex justify-around items-center">
                <div className="text-center">
                  <p className="text-6xl font-oswald font-black text-white">{currentSetScore.home}</p>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">{home.shortName}</p>
                </div>
                <div className="h-20 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-6xl font-oswald font-black text-white">{currentSetScore.away}</p>
                  <p className="text-xs font-black text-amber-500 uppercase tracking-[0.3em]">{away.shortName}</p>
                </div>
             </div>
             <div className="px-20 space-y-4">
               <StatBar label="Current Set Kills" hVal={14} aVal={12} />
               <StatBar label="Current Set Blocks" hVal={3} aVal={5} />
             </div>
          </div>
        )}

        {view === 'ROTATION' && (
          <div className="flex justify-around items-center gap-10">
             <div className="flex-1 bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10">
                <p className="text-[10px] font-black text-blue-400 uppercase text-center mb-4">{home.name}</p>
                <div className="grid grid-cols-3 aspect-[4/3] gap-2">
                   {[4,3,2,5,6,1].map(pos => (
                     <div key={pos} className={`bg-slate-900/80 rounded-xl border border-white/10 flex flex-col items-center justify-center ${match.servingSide === 'home' && pos === 1 ? 'border-amber-400 bg-amber-400/10' : ''}`}>
                       <span className="text-[8px] font-black text-slate-500 mb-0.5">P{pos}</span>
                       <span className="text-xs font-bold text-white">#{match.rotations.home[`p${pos}` as keyof typeof match.rotations.home] || '?'}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="flex-1 bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10">
                <p className="text-[10px] font-black text-amber-400 uppercase text-center mb-4">{away.name}</p>
                <div className="grid grid-cols-3 aspect-[4/3] gap-2">
                   {[2,3,4,1,6,5].map(pos => (
                     <div key={pos} className={`bg-slate-900/80 rounded-xl border border-white/10 flex flex-col items-center justify-center ${match.servingSide === 'away' && pos === 1 ? 'border-amber-400 bg-amber-400/10' : ''}`}>
                       <span className="text-[8px] font-black text-slate-500 mb-0.5">P{pos}</span>
                       <span className="text-xs font-bold text-white">#{match.rotations.away[`p${pos}` as keyof typeof match.rotations.away] || '?'}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsOverlay;
