
import React, { useState } from 'react';
import { useTournament } from '../../store/TournamentContext';
import { Match, Team, Player } from '../../types';
import { Crosshair, ShieldAlert, Zap, AlertTriangle, User, X, Volleyball, Play, Square, RefreshCcw, Activity, LayoutGrid, BarChart3 } from 'lucide-react';

interface Props {
  match: Match;
  onChallenge: () => void;
}

const MatchControl: React.FC<Props> = ({ match, onChallenge }) => {
  const { registerPoint, updateMatch, teams, rotateTeam } = useTournament();
  const [selectedPlayer, setSelectedPlayer] = useState<{ side: 'home' | 'away', player: Player } | null>(null);
  
  const home = teams.find(t => t.id === match.homeTeamId)!;
  const away = teams.find(t => t.id === match.awayTeamId)!;

  const currentScore = match.scores[match.currentSet - 1] || { home: 0, away: 0 };

  const handleAction = (action: 'attack' | 'block' | 'ace' | 'error') => {
    if (!selectedPlayer) return;
    registerPoint(match.id, selectedPlayer.side, selectedPlayer.player.id, action);
    setSelectedPlayer(null);
  };

  const toggleOverlay = (type: 'MATCH_STATS' | 'SET_STATS' | 'ROTATION') => {
    const next = match.activeOverlay === type ? null : type;
    updateMatch({ ...match, activeOverlay: next });
  };

  const winSet = (side: 'home' | 'away') => {
    if (match.status !== 'LIVE') return;
    const nextSets = { ...match.setsWon };
    nextSets[side] += 1;
    if (nextSets[side] === 3) {
      updateMatch({ ...match, setsWon: nextSets, status: 'FINISHED' });
    } else {
      updateMatch({ 
        ...match, setsWon: nextSets, currentSet: match.currentSet + 1,
        scores: [...match.scores, { home: 0, away: 0 }]
      });
    }
  };

  const toggleStatus = () => {
    const newStatus = match.status === 'PENDING' ? 'LIVE' : match.status === 'LIVE' ? 'FINISHED' : 'PENDING';
    updateMatch({ ...match, status: newStatus });
  };

  const setServer = (side: 'home' | 'away', playerId: string) => {
    updateMatch({ ...match, servingSide: side, servingPlayerId: playerId });
  };

  const PlayerChip: React.FC<{ player: Player, side: 'home' | 'away' }> = ({ player, side }) => (
    <div className="flex gap-1">
      <button 
        onClick={() => setSelectedPlayer({ side, player })}
        disabled={match.status !== 'LIVE'}
        className={`flex-1 flex items-center gap-2 p-3 rounded-2xl border transition-all disabled:opacity-50 ${selectedPlayer?.player.id === player.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-500'}`}
      >
        <img src={player.image} className="w-8 h-8 rounded-xl object-cover" />
        <span className="text-xs font-bold uppercase truncate">#{player.number} {player.name}</span>
      </button>
      <button 
        onClick={() => setServer(side, player.id)}
        disabled={match.status !== 'LIVE'}
        className={`p-3 rounded-2xl border transition-all ${match.servingPlayerId === player.id ? 'bg-amber-400 border-amber-400 text-slate-900 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-300 hover:text-amber-500'}`}
        title="Poner al Saque"
      >
        <Volleyball size={16} />
      </button>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header de Estado & Overlays Rápidos */}
      <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${match.status === 'LIVE' ? 'bg-red-500 animate-pulse' : match.status === 'FINISHED' ? 'bg-slate-400' : 'bg-amber-500'}`} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-900">{match.status}</span>
          </div>
          <div className="flex gap-2 border-l border-slate-200 pl-6">
            <button 
              onClick={() => toggleOverlay('MATCH_STATS')}
              className={`p-3 rounded-xl transition-all ${match.activeOverlay === 'MATCH_STATS' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border text-slate-400 hover:text-blue-500'}`}
              title="Estadísticas de Partido"
            ><BarChart3 size={20}/></button>
            <button 
              onClick={() => toggleOverlay('SET_STATS')}
              className={`p-3 rounded-xl transition-all ${match.activeOverlay === 'SET_STATS' ? 'bg-amber-400 text-slate-900 shadow-lg' : 'bg-white border text-slate-400 hover:text-amber-500'}`}
              title="Estadísticas del Set"
            ><Activity size={20}/></button>
            <button 
              onClick={() => toggleOverlay('ROTATION')}
              className={`p-3 rounded-xl transition-all ${match.activeOverlay === 'ROTATION' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white border text-slate-400 hover:text-emerald-500'}`}
              title="Visualizar Rotaciones"
            ><LayoutGrid size={20}/></button>
          </div>
        </div>
        <div className="flex gap-2">
          {match.status !== 'FINISHED' && (
            <button 
              onClick={toggleStatus}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 transition-all shadow-md ${match.status === 'PENDING' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {match.status === 'PENDING' ? <><Play size={14}/> Start Match</> : <><Square size={14}/> Finish Match</>}
            </button>
          )}
        </div>
      </div>

      {/* Marcador Principal */}
      <div className="flex items-center justify-between gap-12 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-amber-50/50 pointer-events-none" />
        
        <div className="flex-1 flex flex-col items-center gap-6 relative z-10">
          <div className="relative group">
            <img src={home.logo} className="h-28 w-36 object-contain drop-shadow-lg" />
            <div className={`absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 shadow-xl border-4 border-white transition-transform ${match.servingSide === 'home' ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}><Volleyball size={24}/></div>
          </div>
          <div className="text-[10rem] font-oswald font-black text-blue-900 leading-none tracking-tighter drop-shadow-sm">{currentScore.home}</div>
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className={`w-6 h-2 rounded-full transition-all ${match.setsWon.home >= i ? 'bg-blue-600 w-10 shadow-md' : 'bg-slate-100'}`} />)}
          </div>
          <button onClick={() => rotateTeam(match.id, 'home')} className="p-4 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all shadow-sm"><RefreshCcw size={20}/></button>
        </div>

        <div className="flex flex-col items-center gap-8 relative z-10">
           <div className="bg-slate-900 px-8 py-3 rounded-2xl text-xs font-black uppercase text-white tracking-[0.4em] shadow-lg">SET {match.currentSet}</div>
           <div className="h-32 w-px bg-slate-200" />
           <div className="flex flex-col gap-3">
             <button onClick={() => winSet('home')} disabled={match.status !== 'LIVE'} className="px-8 py-4 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 shadow-sm border border-blue-100">Set Home</button>
             <button onClick={() => winSet('away')} disabled={match.status !== 'LIVE'} className="px-8 py-4 bg-amber-50 text-amber-700 rounded-2xl text-[10px] font-black uppercase hover:bg-amber-400 hover:text-slate-900 transition-all disabled:opacity-50 shadow-sm border border-amber-100">Set Away</button>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-6 relative z-10">
          <div className="relative group">
            <img src={away.logo} className="h-28 w-36 object-contain drop-shadow-lg" />
            <div className={`absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 shadow-xl border-4 border-white transition-transform ${match.servingSide === 'away' ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}><Volleyball size={24}/></div>
          </div>
          <div className="text-[10rem] font-oswald font-black text-blue-900 leading-none tracking-tighter drop-shadow-sm">{currentScore.away}</div>
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className={`w-6 h-2 rounded-full transition-all ${match.setsWon.away >= i ? 'bg-blue-600 w-10 shadow-md' : 'bg-slate-100'}`} />)}
          </div>
          <button onClick={() => rotateTeam(match.id, 'away')} className="p-4 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all shadow-sm"><RefreshCcw size={20}/></button>
        </div>
      </div>

      {match.status === 'LIVE' && (
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex justify-between items-center"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{home.name}</p></div>
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-2 custom-scroll">
              {home.players.map(p => <PlayerChip key={p.id} player={p} side="home" />)}
            </div>
          </div>
          <div className="space-y-4 text-right">
            <div className="flex justify-between items-center flex-row-reverse"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{away.name}</p></div>
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-2 custom-scroll">
              {away.players.map(p => <PlayerChip key={p.id} player={p} side="away" />)}
            </div>
          </div>
        </div>
      )}

      {selectedPlayer && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
          <div className="bg-blue-600 w-full max-w-2xl p-12 rounded-[3.5rem] text-white animate-fade-in shadow-[0_40px_100px_rgba(30,58,138,0.5)] border border-white/20">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20"><User size={40} /></div>
                 <div>
                    <p className="text-xs font-bold uppercase opacity-60 mb-1 tracking-widest">Register Player Point</p>
                    <p className="font-oswald text-4xl font-bold uppercase tracking-tight">#{selectedPlayer.player.number} {selectedPlayer.player.name}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="p-4 hover:bg-white/20 rounded-full transition-all"><X size={32}/></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { id: 'attack', icon: Crosshair, label: 'Attack' },
                { id: 'block', icon: ShieldAlert, label: 'Block' },
                { id: 'ace', icon: Zap, label: 'Ace' },
                { id: 'error', icon: AlertTriangle, label: 'Error', color: 'bg-rose-500' }
              ].map(btn => (
                <button 
                  key={btn.id} 
                  onClick={() => handleAction(btn.id as any)} 
                  className={`flex flex-col items-center gap-4 p-8 ${btn.color || 'bg-white/10'} hover:bg-white/20 rounded-[2.5rem] transition-all border border-white/10 group`}
                >
                  <btn.icon size={32} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchControl;
