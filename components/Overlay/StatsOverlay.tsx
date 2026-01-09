
import React from 'react';
import { Match, Team, Player } from '../../types';
import { Volleyball } from 'lucide-react';

interface Props {
  match: Match;
  home: Team;
  away: Team;
  view?: 'MATCH_STATS' | 'SET_STATS' | 'ROTATION_HOME' | 'ROTATION_AWAY';
}

const StatsOverlay: React.FC<Props> = ({ match, home, away, view = 'MATCH_STATS' }) => {
  const getBestPlayer = (team: Team) => {
    return team.players.length > 0 ? [...team.players].sort((a, b) => b.stats.points - a.stats.points)[0] : null;
  };

  const bestHome = getBestPlayer(home);
  const bestAway = getBestPlayer(away);

  const StatBar = ({ label, hVal, aVal, colorH = 'bg-blue-600', colorA = 'bg-amber-400' }: any) => {
    const total = hVal + aVal || 1;
    const hPerc = (hVal / total) * 100;
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-end px-1">
          <span className="font-oswald text-base font-bold text-white">{hVal}</span>
          <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{label}</span>
          <span className="font-oswald text-base font-bold text-white">{aVal}</span>
        </div>
        <div className="flex h-1.5 bg-white/5 rounded-full overflow-hidden p-px border border-white/5">
          <div className={`${colorH} h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.4)]`} style={{ width: `${hPerc}%` }} />
          <div className={`${colorA} h-full rounded-full transition-all duration-1000 ml-auto shadow-[0_0_8px_rgba(251,191,36,0.4)]`} style={{ width: `${100 - hPerc}%` }} />
        </div>
      </div>
    );
  };

  const currentSetScore = match.scores[match.currentSet - 1] || { home: 0, away: 0 };

  const render3DRotation = (team: Team, rotation: any, side: 'home' | 'away') => {
    const positions = [
      { id: 4, label: 'P4', top: '10%', left: '15%' },
      { id: 3, label: 'P3', top: '10%', left: '50%' },
      { id: 2, label: 'P2', top: '10%', left: '85%' },
      { id: 5, label: 'P5', top: '65%', left: '15%' },
      { id: 6, label: 'P6', top: '65%', left: '50%' },
      { id: 1, label: 'P1', top: '65%', left: '85%' },
    ];

    return (
      <div className="flex flex-col items-center py-4 w-full animate-fade-in">
        <div className="flex items-center gap-3 mb-6 bg-slate-900/60 p-2 rounded-xl border border-white/5">
           <img src={team.logo} className="h-8 w-8 object-contain bg-white rounded-lg p-1" alt="" />
           <h3 className="text-xl font-oswald font-black text-white uppercase tracking-tighter">ROTACIÓN: {team.name}</h3>
           {match.servingSide === side && <Volleyball className="text-amber-400 animate-pulse" size={20} />}
        </div>
        
        {/* Cancha 3D */}
        <div className="relative w-full max-w-[400px] h-[260px] preserve-3d">
           <div className="absolute inset-0 bg-blue-600/20 border-2 border-white/40 rounded-lg transform-3d shadow-[0_40px_60px_rgba(0,0,0,0.5)]">
              {/* Lineas de cancha */}
              <div className="absolute top-[35%] w-full h-0.5 bg-white/40" />
              <div className="absolute inset-4 border border-white/10" />
           </div>

           {positions.map(pos => {
              const playerId = (rotation as any)[`p${pos.id}`];
              const player = team.players.find(p => p.id === playerId);
              const isServing = match.servingSide === side && pos.id === 1;
              return (
                <div 
                  key={pos.id} 
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className={`
                    flex flex-col items-center p-2 rounded-xl border-2 backdrop-blur-md transition-all
                    ${isServing ? 'bg-amber-400 border-amber-500 scale-125 shadow-lg' : 'bg-slate-900/80 border-white/20'}
                  `}>
                    <span className={`text-[10px] font-oswald font-black ${isServing ? 'text-slate-950' : 'text-white'}`}>
                      {player ? `#${player.number}` : '--'}
                    </span>
                    <span className={`text-[6px] font-bold uppercase truncate max-w-[40px] ${isServing ? 'text-slate-800' : 'text-slate-400'}`}>
                      {player ? player.name.split(' ')[0] : 'EMPTY'}
                    </span>
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-slate-800 rounded-full border border-white/20 flex items-center justify-center text-[5px] font-black text-white">
                      {pos.id}
                    </div>
                  </div>
                </div>
              );
           })}
        </div>

        <style>{`
          .preserve-3d { perspective: 800px; }
          .transform-3d { transform: rotateX(45deg); transform-style: preserve-3d; }
        `}</style>
      </div>
    );
  };

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[650px] bg-slate-950/98 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden animate-fade-in z-[60] flex flex-col select-none">
      <div className={`p-4 flex justify-between items-center border-b border-white/10 ${view?.includes('ROTATION') ? 'bg-slate-900/40' : 'bg-blue-900/20'}`}>
        <div className="flex items-center gap-3">
          <img src={home.logo} className="h-6 w-10 object-contain bg-white rounded-lg p-1 shadow-sm" alt="" />
          <h2 className="text-xl font-oswald font-bold text-white uppercase tracking-tighter">{home.shortName}</h2>
          {match.servingSide === 'home' && <Volleyball size={16} className="text-amber-400 animate-bounce" />}
        </div>
        <div className="px-4 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-amber-400 tracking-[0.3em] border border-white/5">
           {view === 'MATCH_STATS' ? 'ESTADÍSTICAS DEL ENCUENTRO' : view === 'SET_STATS' ? `ESTADÍSTICAS SET ${match.currentSet}` : 'FORMACIÓN TÁCTICA'}
        </div>
        <div className="flex items-center gap-3 text-right">
          {match.servingSide === 'away' && <Volleyball size={16} className="text-amber-400 animate-bounce" />}
          <h2 className="text-xl font-oswald font-bold text-white uppercase tracking-tighter">{away.shortName}</h2>
          <img src={away.logo} className="h-6 w-10 object-contain bg-white rounded-lg p-1 shadow-sm" alt="" />
        </div>
      </div>

      <div className="p-6">
        {view === 'MATCH_STATS' && (
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <StatBar label="PUNTOS TOTALES" hVal={home.players.reduce((a,b) => a + b.stats.points, 0)} aVal={away.players.reduce((a,b) => a + b.stats.points, 0)} />
              <StatBar label="ACES" hVal={home.players.reduce((a,b) => a + b.stats.aces, 0)} aVal={away.players.reduce((a,b) => a + b.stats.aces, 0)} colorH="bg-amber-400" colorA="bg-blue-400" />
              <StatBar label="BLOQUEOS" hVal={home.players.reduce((a,b) => a + b.stats.blocks, 0)} aVal={away.players.reduce((a,b) => a + b.stats.blocks, 0)} colorH="bg-emerald-500" colorA="bg-blue-500" />
            </div>
            <div className="space-y-2">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 border-l-2 border-blue-600 pl-2">MEJORES ATLETAS</p>
              {[bestHome, bestAway].map((p, i) => p && (
                <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 shadow-inner">
                  <img src={p.image} className="w-12 h-12 rounded-xl object-cover border-2 border-white/10" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-oswald font-bold text-white leading-none truncate">#{p.number} {p.name}</p>
                    <p className="text-[7px] font-black text-blue-400 mt-1 uppercase">{i === 0 ? home.name : away.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-oswald font-black text-amber-400 leading-none">{p.stats.points}</p>
                    <p className="text-[7px] font-bold text-slate-500 uppercase">PTS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'SET_STATS' && (
          <div className="flex flex-col gap-6 animate-fade-in py-4">
             <div className="flex justify-around items-center">
                <div className="text-center group">
                  <p className="text-7xl font-oswald font-black text-white group-hover:text-blue-500 transition-colors">{currentSetScore.home}</p>
                  <p className="text-[10px] font-black text-blue-500 uppercase mt-2 tracking-widest">{home.name}</p>
                </div>
                <div className="h-16 w-px bg-white/10" />
                <div className="text-center group">
                  <p className="text-7xl font-oswald font-black text-white group-hover:text-amber-500 transition-colors">{currentSetScore.away}</p>
                  <p className="text-[10px] font-black text-amber-500 uppercase mt-2 tracking-widest">{away.name}</p>
                </div>
             </div>
             <div className="px-20">
               <StatBar label="DIFERENCIA DE PUNTAJE" hVal={currentSetScore.home} aVal={currentSetScore.away} />
             </div>
          </div>
        )}

        {view === 'ROTATION_HOME' && render3DRotation(home, match.rotations.home, 'home')}
        {view === 'ROTATION_AWAY' && render3DRotation(away, match.rotations.away, 'away')}
      </div>

      <div className="bg-slate-900/60 p-2 border-t border-white/5 flex justify-center items-center">
         <div className="text-slate-600 font-oswald font-black italic text-[8px] uppercase tracking-[0.5em]">JSPORT DATA STREAMING • LIVE</div>
      </div>
    </div>
  );
};

export default StatsOverlay;
