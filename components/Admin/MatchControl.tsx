
import React, { useState } from 'react';
import { useTournament } from '../../store/TournamentContext';
import { Match, Team, Player } from '../../types';
import { Crosshair, ShieldAlert, Zap, AlertTriangle, User, X, Volleyball, Play, Square, RefreshCcw, Activity, LayoutGrid, BarChart3, Monitor, Tv, Eye, Maximize, Minimize, History } from 'lucide-react';

interface Props {
  match: Match;
  onChallenge: (mode: 'full' | 'mini') => void;
}

const MatchControl: React.FC<Props> = ({ match, onChallenge }) => {
  const { registerPoint, updateMatch, teams, rotateTeam } = useTournament();
  const [selectedPlayer, setSelectedPlayer] = useState<{ side: 'home' | 'away', player: Player } | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  
  const home = teams.find(t => t.id === match.homeTeamId)!;
  const away = teams.find(t => t.id === match.awayTeamId)!;
  const currentScore = match.scores[match.currentSet - 1] || { home: 0, away: 0 };

  const handleAction = (action: 'attack' | 'block' | 'ace' | 'error') => {
    if (!selectedPlayer) return;
    registerPoint(match.id, selectedPlayer.side, selectedPlayer.player.id, action);
    setLastAction(action);
    setTimeout(() => setLastAction(null), 1000);
    setSelectedPlayer(null);
  };

  const toggleOverlay = (type: Match['activeOverlay']) => {
    updateMatch({ ...match, activeOverlay: match.activeOverlay === type ? null : type });
  };

  const triggerReplay = () => {
    updateMatch({ ...match, showReplay: true });
    setTimeout(() => {
      updateMatch({ ...match, showReplay: false });
    }, 5000);
  };

  const winSet = (side: 'home' | 'away') => {
    const nextSets = { ...match.setsWon };
    nextSets[side] += 1;
    if (nextSets[side] === 3) {
      updateMatch({ ...match, setsWon: nextSets, status: 'FINISHED' });
    } else {
      updateMatch({ ...match, setsWon: nextSets, currentSet: match.currentSet + 1, scores: [...match.scores, { home: 0, away: 0 }] });
    }
  };

  const PlayerChip: React.FC<{ player: Player, side: 'home' | 'away' }> = ({ player, side }) => (
    <div className="flex gap-1 group">
      <button 
        onClick={() => setSelectedPlayer({ side, player })}
        className={`flex-1 flex items-center gap-2 p-1.5 rounded-lg border transition-all active:scale-110 ${selectedPlayer?.player.id === player.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-transparent border-slate-200 text-slate-600 hover:border-blue-400'}`}
      >
        <img src={player.image} className="w-7 h-7 rounded object-cover" alt="" />
        <span className="text-[10px] font-bold uppercase truncate">#{player.number} {player.name}</span>
      </button>
      <button 
        onClick={() => updateMatch({ ...match, servingSide: side, servingPlayerId: player.id })}
        className={`p-1.5 rounded-lg border transition-all active:scale-110 ${match.servingPlayerId === player.id ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-sm' : 'bg-transparent border-slate-200 text-slate-300 hover:text-amber-500'}`}
        title="Poner al saque"
      ><Volleyball size={12} /></button>
    </div>
  );

  return (
    <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
             <div className={`w-2 h-2 rounded-full ${match.status === 'LIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
             <span className="text-[9px] font-black uppercase text-slate-900">{match.status}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => updateMatch({ ...match, showScoreboard: !match.showScoreboard })} className={`p-1.5 rounded border transition-all active:scale-110 ${match.showScoreboard ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-slate-200 text-slate-400 hover:border-blue-400'}`} title="Marcador Principal"><Monitor size={14}/></button>
            <button onClick={() => updateMatch({ ...match, showMiniBug: !match.showMiniBug })} className={`p-1.5 rounded border transition-all active:scale-110 ${match.showMiniBug ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-slate-200 text-slate-400 hover:border-blue-400'}`} title="Mini Marcador"><Tv size={14}/></button>
            <button onClick={triggerReplay} className={`p-1.5 rounded border bg-transparent border-slate-200 text-slate-400 hover:border-amber-500 hover:text-amber-500 transition-all active:scale-110`} title="Trigger Replay"><History size={14}/></button>
          </div>
          <div className="flex gap-1 border-l border-slate-200 pl-3">
            {['MATCH_STATS', 'SET_STATS'].map((o: any) => (
              <button key={o} onClick={() => toggleOverlay(o)} className={`px-2 py-1 rounded border text-[8px] font-black uppercase transition-all active:scale-110 ${match.activeOverlay === o ? 'bg-slate-900 border-slate-900 text-white' : 'bg-transparent border-slate-200 text-slate-400 hover:border-slate-900'}`}>{o.split('_')[0] === 'MATCH' ? 'PARTIDO' : 'SET'}</button>
            ))}
            <button onClick={() => toggleOverlay('ROTATION_HOME')} className={`px-2 py-1 rounded border text-[8px] font-black uppercase transition-all active:scale-110 ${match.activeOverlay === 'ROTATION_HOME' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-slate-200 text-slate-400'}`}>ROT. {home.shortName}</button>
            <button onClick={() => toggleOverlay('ROTATION_AWAY')} className={`px-2 py-1 rounded border text-[8px] font-black uppercase transition-all active:scale-110 ${match.activeOverlay === 'ROTATION_AWAY' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-transparent border-slate-200 text-slate-400'}`}>ROT. {away.shortName}</button>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-200 p-0.5 rounded-lg">
             <button onClick={() => onChallenge('full')} className="p-1.5 hover:bg-white rounded transition-all text-slate-600 active:scale-110" title="Challenge Full Screen"><Maximize size={12}/></button>
             <button onClick={() => onChallenge('mini')} className="p-1.5 hover:bg-white rounded transition-all text-slate-600 active:scale-110" title="Challenge PiP"><Minimize size={12}/></button>
           </div>
           <button onClick={() => updateMatch({ ...match, status: match.status === 'PENDING' ? 'LIVE' : 'FINISHED' })} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all shadow-sm active:scale-110 ${match.status === 'PENDING' ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-white'}`}>{match.status === 'PENDING' ? 'INICIAR' : 'TERMINAR'}</button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 py-8 px-10 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex-1 flex flex-col items-center gap-3">
          <img src={home.logo} className={`h-14 w-20 object-contain transition-transform duration-300 ${match.servingSide === 'home' ? 'scale-110 drop-shadow-lg' : 'opacity-60'}`} alt="" />
          <div className="text-7xl font-oswald font-black text-blue-900 leading-none">{currentScore.home}</div>
          <div className="flex gap-1">
            {[1,2,3].map(i => <div key={i} className={`w-5 h-1.5 rounded-full transition-all ${match.setsWon.home >= i ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-slate-200'}`} />)}
          </div>
          <button onClick={() => rotateTeam(match.id, 'home')} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase tracking-tighter hover:text-blue-600 transition-all flex items-center gap-1 shadow-sm active:scale-110"><RefreshCcw size={10}/> ROTAR</button>
        </div>

        <div className="flex flex-col items-center gap-4">
           <div className="bg-slate-950 px-5 py-1.5 rounded-full text-[9px] font-black text-white tracking-[0.2em] shadow-lg">SET {match.currentSet}</div>
           <div className="flex flex-col gap-1.5">
             <button onClick={() => winSet('home')} className="px-5 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-lg text-[8px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-110">GANA SET {home.shortName}</button>
             <button onClick={() => winSet('away')} className="px-5 py-2 bg-transparent border border-amber-600 text-amber-600 rounded-lg text-[8px] font-black uppercase hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-110">GANA SET {away.shortName}</button>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-3">
          <img src={away.logo} className={`h-14 w-20 object-contain transition-transform duration-300 ${match.servingSide === 'away' ? 'scale-110 drop-shadow-lg' : 'opacity-60'}`} alt="" />
          <div className="text-7xl font-oswald font-black text-slate-900 leading-none">{currentScore.away}</div>
          <div className="flex gap-1">
            {[1,2,3].map(i => <div key={i} className={`w-5 h-1.5 rounded-full transition-all ${match.setsWon.away >= i ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'bg-slate-200'}`} />)}
          </div>
          <button onClick={() => rotateTeam(match.id, 'away')} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase tracking-tighter hover:text-blue-600 transition-all flex items-center gap-1 shadow-sm active:scale-110"><RefreshCcw size={10}/> ROTAR</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {(['home', 'away'] as const).map((side) => {
          const team = side === 'home' ? home : away;
          return (
            <div key={side} className="space-y-3">
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center"><span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Atletas {team.name}</span><span className="text-[7px] font-bold text-slate-400">{team.players.length} TOTAL</span></div>
              <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1 custom-scroll">
                {team.players.map(p => <PlayerChip key={p.id} player={p} side={side} />)}
              </div>
            </div>
          )
        })}
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-sm p-8 rounded-[2rem] animate-fade-in shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <img src={selectedPlayer.player.image} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xl" alt="" />
                 <div><p className="text-[9px] font-black uppercase text-blue-600 tracking-widest">REGISTRAR ACCIÓN</p><p className="font-oswald text-2xl font-black uppercase tracking-tighter">#{selectedPlayer.player.number} {selectedPlayer.player.name}</p></div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'attack', icon: Crosshair, label: 'Ataque', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
                { id: 'block', icon: ShieldAlert, label: 'Bloqueo', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
                { id: 'ace', icon: Zap, label: 'Ace', color: 'bg-amber-400 hover:bg-amber-500 text-slate-950' },
                { id: 'error', icon: AlertTriangle, label: 'Error', color: 'bg-rose-500 hover:bg-rose-600 text-white' }
              ].map(btn => (
                <button key={btn.id} onClick={() => handleAction(btn.id as any)} className={`flex items-center gap-4 p-5 rounded-2xl transition-all shadow-md active:scale-110 ${btn.color}`}>
                  <btn.icon size={20} /><span className="text-[11px] font-black uppercase tracking-wide">{btn.label}</span>
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
