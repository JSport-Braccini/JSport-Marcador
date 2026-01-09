
import React, { useState, useRef, useEffect } from 'react';
import { TournamentProvider, useTournament } from './store/TournamentContext';
import { UserRole, Team, Player, Tournament, Match, User, Rotation } from './types';
import VNLMainScoreboard from './components/Overlay/VNLMainScoreboard';
import MiniBug from './components/Overlay/MiniBug';
import ChallengeReplay from './components/Overlay/ChallengeReplay';
import MatchControl from './components/Admin/MatchControl';
import StatsOverlay from './components/Overlay/StatsOverlay';
import PlayerStatsBug from './components/Overlay/PlayerStatsBug';
import ReplayOverlay from './components/Overlay/ReplayOverlay';
import { 
  Volleyball, Users, Trophy, PlayCircle, LogOut, 
  UserPlus, Trash2, MonitorPlay, Plus, Image as ImageIcon, X, Edit3, Camera, ExternalLink, ShieldCheck,
  RefreshCcw, User as UserIcon, Calendar, Share2, Download, Star, MessageCircle, Briefcase, UserCheck, Shield, Settings
} from 'lucide-react';

const NavIcon = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${active ? 'bg-blue-600/10 text-blue-500 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
  >
    <Icon size={16} />
    <span className={`text-[7px] font-black uppercase tracking-tight mt-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const Modal = ({ title, children, onClose }: { title: string, children?: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
    <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-fade-in text-slate-900">
      <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-xs font-oswald font-bold uppercase text-blue-900 tracking-tight">{title}</h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-rose-500 transition-colors"><X size={16} /></button>
      </div>
      <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);

const ShareCard = ({ match, home, away, tournament, onClose }: any) => {
  const homeCaptain = home.players.find((p: any) => p.id === home.captainId) || home.players[0];
  const awayCaptain = away.players.find((p: any) => p.id === away.captainId) || away.players[0];

  const shareToWhatsApp = () => {
    const text = `🏐 ¡JSPORT LIVE! 🏆 ${tournament.name} 🔥 ${home.name} vs ${away.name} 📲 ¡Síguelo en JSPORT!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Modal title="Poster de Encuentro" onClose={onClose}>
      <div className="space-y-3">
        <div id="share-card" className="relative aspect-[4/5] w-full bg-slate-950 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center group border border-white/10">
          <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60 scale-105" alt="court" />
             <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-slate-950/40 to-blue-900/60" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center w-full h-full justify-between py-4 px-3">
            <div className="flex flex-col items-center gap-1 w-full pt-2">
              <img src={tournament?.logo} className="h-16 w-16 object-contain drop-shadow-2xl mb-1" />
              <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] drop-shadow-md">{tournament?.name}</h4>
              <h2 className="text-2xl font-oswald font-black italic text-white uppercase text-center tracking-tighter leading-none">VERSUS</h2>
            </div>

            <div className="w-full flex justify-between items-center relative flex-1">
               <div className="flex flex-col items-center flex-1 relative h-full justify-center">
                  {homeCaptain && (
                    <div className="relative w-full h-32 flex flex-col items-center">
                       <img src={homeCaptain.image} className="h-full object-contain z-0 drop-shadow-2xl scale-125 translate-y-2" />
                       <img src={home.logo} className="absolute bottom-0 left-1/2 -translate-x-1/2 h-14 w-14 object-contain bg-white rounded-lg p-1.5 shadow-2xl border-2 border-blue-600 z-10" />
                    </div>
                  )}
                  <h3 className="font-oswald text-xl font-black uppercase text-white tracking-tighter drop-shadow-lg mt-2">{home.shortName}</h3>
               </div>

               <div className="bg-amber-400 text-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-black italic text-base shadow-2xl z-30 mx-1 border-2 border-slate-950">VS</div>

               <div className="flex flex-col items-center flex-1 relative h-full justify-center">
                  {awayCaptain && (
                    <div className="relative w-full h-32 flex flex-col items-center">
                       <img src={awayCaptain.image} className="h-full object-contain z-0 drop-shadow-2xl scale-125 translate-y-2" />
                       <img src={away.logo} className="absolute bottom-0 left-1/2 -translate-x-1/2 h-14 w-14 object-contain bg-white rounded-lg p-1.5 shadow-2xl border-2 border-amber-500 z-10" />
                    </div>
                  )}
                  <h3 className="font-oswald text-xl font-black uppercase text-white tracking-tighter drop-shadow-lg mt-2">{away.shortName}</h3>
               </div>
            </div>

            <div className="w-full text-center relative z-10">
               <div className="bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 w-full shadow-2xl">
                 <p className="text-2xl font-oswald font-black text-white tracking-tighter leading-none uppercase">{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} HRS</p>
                 <div className="flex items-center justify-center gap-2 text-amber-400 mt-1">
                   <Calendar size={10} />
                   <span className="text-[8px] font-black uppercase tracking-[0.2em]">{new Date(match.date).toLocaleDateString()}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl font-bold uppercase text-[8px] border border-white/5 active:scale-110"><Download size={12} /> Guardar</button>
           <button onClick={shareToWhatsApp} className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl font-bold uppercase text-[8px] active:scale-110"><MessageCircle size={12} /> WhatsApp</button>
        </div>
      </div>
    </Modal>
  );
};

const LoginForm = () => {
  const { setCurrentUser, users } = useTournament();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  const submit = (e: any) => {
    e.preventDefault();
    const found = users.find(usr => usr.username === u && usr.password === p);
    if (found) setCurrentUser(found);
    else setErr('Credenciales incorrectas');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-xs bg-white p-8 rounded-[2rem] shadow-2xl space-y-6 animate-fade-in text-slate-900">
        <div className="text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Volleyball size={28} className="text-white" /></div>
          <h1 className="text-xl font-oswald font-black text-blue-950 uppercase leading-none">J<span className="text-blue-600">SPORT</span></h1>
          <p className="text-slate-400 font-bold uppercase text-[6px] tracking-[0.3em] mt-1">PRO PANEL</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input type="text" placeholder="Username" required value={u} onChange={e=>setU(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 font-bold text-xs text-slate-900" />
          <input type="password" placeholder="Password" required value={p} onChange={e=>setP(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 font-bold text-xs text-slate-900" />
          {err && <p className="text-rose-500 text-[8px] font-black text-center uppercase">{err}</p>}
          <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl uppercase text-[9px] tracking-widest transition-all">ACCEDER</button>
        </form>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { 
    currentUser, setCurrentUser, matches, teams, tournaments, users,
    removeUser, addUser, addTeam, updateTeam, removeTeam, addTournament, 
    removeTournament, createFixture, removeMatch, updateMatch, deletePlayer, updatePlayer
  } = useTournament();

  const [activeTab, setActiveTab] = useState('LIVE');
  const [challengeMode, setChallengeMode] = useState<'full' | 'mini' | null>(null);
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [addTeamModal, setAddTeamModal] = useState(false);
  const [editTeamId, setEditTeamId] = useState<string | null>(null);
  const [addTournamentModal, setAddTournamentModal] = useState(false);
  const [addPlayerTo, setAddPlayerTo] = useState<string | null>(null);
  const [editPlayerInfo, setEditPlayerInfo] = useState<{ teamId: string, playerId: string } | null>(null);
  const [addUserModal, setAddUserModal] = useState(false);
  const [showShareMatch, setShowShareMatch] = useState<Match | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [tempLogo, setTempLogo] = useState('');
  const [tempImg, setTempImg] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const liveMatch = matches.find(m => m.id === activeMatchId) || matches.find(m => m.status === 'LIVE') || (matches.length > 0 ? matches[0] : null);
  const h = liveMatch ? teams.find(t => t.id === liveMatch.homeTeamId) : null;
  const a = liveMatch ? teams.find(t => t.id === liveMatch.awayTeamId) : null;
  const tr = liveMatch ? tournaments.find(t => t.id === liveMatch.tournamentId) : null;

  useEffect(() => {
    if (isBroadcast) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Media error:", err));
    } else if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }, [isBroadcast]);

  const handleFile = (e: any, cb: any) => {
    const f = e.target.files?.[0];
    if (f) { const r = new FileReader(); r.onloadend = () => cb(r.result as string); r.readAsDataURL(f); }
  };

  if (!currentUser) return <LoginForm />;

  if (isBroadcast && liveMatch && h && a && tr) {
    const servingPlayer = (liveMatch.servingSide === 'home' ? h : a)?.players.find(p => p.id === liveMatch.servingPlayerId);
    return (
      <div className="fixed inset-0 bg-black z-[200] overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-40 pointer-events-none" />
        
        {liveMatch.showMiniBug && <MiniBug match={liveMatch} home={h} away={a} tournament={tr} />}
        {liveMatch.showScoreboard && <VNLMainScoreboard match={liveMatch} homeTeam={h} awayTeam={a} tournament={tr} />}
        {liveMatch.activeOverlay && <StatsOverlay match={liveMatch} home={h} away={a} view={liveMatch.activeOverlay} />}
        {servingPlayer && liveMatch.showServerOverlay && <PlayerStatsBug player={servingPlayer} team={liveMatch.servingSide === 'home' ? h : a} />}
        {liveMatch.showReplay && <ReplayOverlay isActive={true} />}
        <ChallengeReplay isOpen={!!challengeMode} mode={challengeMode || 'full'} onClose={() => setChallengeMode(null)} />
        
        <div className="fixed bottom-6 right-6 w-24 h-24 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center animate-fade-in z-50">
           <img src={tr.logo} className="w-full h-full object-contain drop-shadow-lg" alt="logo corner" />
        </div>

        <button onClick={() => setIsBroadcast(false)} className="absolute top-6 right-6 p-4 bg-slate-900/80 text-white rounded-full hover:bg-amber-400 hover:text-slate-950 transition-all opacity-0 hover:opacity-100 z-[300] active:scale-125"><MonitorPlay size={24} /></button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-inter text-sm">
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('LIVE')}>
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"><Volleyball size={20} className="text-white" /></div>
             <h2 className="text-lg font-oswald font-black text-blue-950 uppercase tracking-tighter">J<span className="text-blue-600">SPORT</span></h2>
          </div>
          <div className="flex items-center gap-1">
            <NavIcon icon={PlayCircle} label="VIVO" active={activeTab === 'LIVE'} onClick={() => setActiveTab('LIVE')} />
            <NavIcon icon={Users} label="EQUIPOS" active={activeTab === 'TEAMS'} onClick={() => setActiveTab('TEAMS')} />
            <NavIcon icon={Trophy} label="TORNEOS" active={activeTab === 'TOURNAMENTS'} onClick={() => setActiveTab('TOURNAMENTS')} />
            {currentUser.role === 'ADMIN' && <NavIcon icon={Shield} label="ADMIN" active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')} />}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsBroadcast(true)} className="px-4 py-2 bg-slate-950 text-white rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-110"><MonitorPlay size={14} /> TRANSMISIÓN</button>
          <button onClick={() => setCurrentUser(null)} className="p-2 text-slate-300 hover:text-rose-500 transition-all bg-slate-50 rounded-lg"><LogOut size={16} /></button>
        </div>
      </nav>

      <main className="flex-1 p-4 max-w-[900px] mx-auto w-full">
        {activeTab === 'LIVE' && liveMatch && h && a && tr ? (
          <div className="animate-fade-in"><MatchControl match={liveMatch} onChallenge={(mode) => setChallengeMode(mode)} /></div>
        ) : activeTab === 'LIVE' ? (
           <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 cursor-pointer" onClick={() => setActiveTab('TOURNAMENTS')}>
              <PlayCircle size={32} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-black uppercase text-[8px] tracking-widest">Selecciona un torneo para comenzar.</p>
           </div>
        ) : null}

        {activeTab === 'TEAMS' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end border-b border-blue-600/10 pb-2"><h3 className="text-xl font-oswald font-black text-blue-950 uppercase">Entidades</h3><button onClick={() => setAddTeamModal(true)} className="px-3 py-1.5 bg-blue-600 text-white font-black rounded-lg flex items-center gap-1 uppercase text-[8px] tracking-widest active:scale-110"><Plus size={14} /> Equipo</button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map(t => (
                <div key={t.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm group flex flex-col hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={t.logo} className="w-8 h-8 object-contain bg-slate-50 rounded-lg p-1 border shadow-sm" alt="" />
                    <div className="flex-1 truncate"><h4 className="text-[10px] font-black text-blue-950 uppercase leading-none mb-1 truncate">{t.name}</h4><p className="text-[7px] font-bold text-slate-400 uppercase truncate">{t.delegate}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button onClick={() => setSelectedTeamId(t.id)} className="py-1.5 bg-slate-50 text-slate-900 text-[7px] font-black uppercase rounded-lg active:scale-110">PLANILLA</button>
                    <button onClick={() => setAddPlayerTo(t.id)} className="py-1.5 border border-blue-600 text-blue-600 text-[7px] font-black uppercase rounded-lg active:scale-110">FICHAR</button>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditTeamId(t.id); setTempLogo(t.logo); }} className="p-1 text-blue-600 bg-white shadow rounded-lg active:scale-125"><Edit3 size={10} /></button>
                    <button onClick={() => removeTeam(t.id)} className="p-1 text-rose-500 bg-white shadow rounded-lg active:scale-125"><Trash2 size={10} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-end border-b border-blue-600/10 pb-2"><h3 className="text-xl font-oswald font-black text-blue-950 uppercase">Accesos</h3><button onClick={() => setAddUserModal(true)} className="px-3 py-1.5 bg-blue-600 text-white font-black rounded-lg flex items-center gap-1 uppercase text-[8px] active:scale-110"><UserPlus size={14} /> Nuevo</button></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {users.map(u => (
                  <div key={u.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center group shadow-sm">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300"><UserIcon size={18} /></div>
                       <div><p className="font-black text-blue-950 uppercase text-xs">{u.name}</p><p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{u.role}</p></div>
                    </div>
                    {u.id !== 'u1' && <button onClick={() => removeUser(u.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg active:scale-125"><Trash2 size={14}/></button>}
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'TOURNAMENTS' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-end border-b border-blue-600/10 pb-2"><h3 className="text-xl font-oswald font-black text-blue-950 uppercase">Torneos</h3><button onClick={() => setAddTournamentModal(true)} className="px-3 py-1.5 bg-blue-600 text-white font-black rounded-lg flex items-center gap-1 uppercase text-[8px] active:scale-110"><Trophy size={14} /> Torneo</button></div>
             <div className="grid grid-cols-1 gap-4">
               {tournaments.map(t => (
                 <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <img src={t.logo} className="w-16 h-16 object-contain rounded-xl border bg-slate-50 p-2" alt="" />
                        <div><h4 className="text-2xl font-oswald font-black text-blue-950 uppercase tracking-tighter leading-none mb-1">{t.name}</h4><p className="text-[8px] text-slate-400 font-black uppercase">{t.teams.length} Equipos</p></div>
                      </div>
                      <button onClick={() => removeTournament(t.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 active:scale-125"><Trash2 size={18}/></button>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-1"><span className="text-[8px] font-black text-slate-400 uppercase">CALENDARIO</span><button onClick={() => createFixture(t.id, t.groups)} className="text-[8px] font-black text-blue-600 uppercase active:scale-110">SORTEAR</button></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scroll">
                        {matches.filter(m => m.tournamentId === t.id).map(m => (
                          <div key={m.id} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 group/item hover:bg-white transition-all">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="font-oswald font-black text-sm text-blue-900">{teams.find(tm=>tm.id===m.homeTeamId)?.shortName}</span><span className="text-[6px] text-slate-300 font-black italic">VS</span><span className="font-oswald font-black text-sm text-blue-900">{teams.find(tm=>tm.id===m.awayTeamId)?.shortName}</span></div>
                                <div className="flex items-center gap-2">
                                   <button onClick={() => setShowShareMatch(m)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg active:scale-125"><Share2 size={12}/></button>
                                   <button onClick={() => { setActiveMatchId(m.id); setActiveTab('LIVE'); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg active:scale-125"><ExternalLink size={12}/></button>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <Calendar size={8} className="text-slate-400" />
                                <input type="datetime-local" defaultValue={m.date.slice(0, 16)} onChange={(e) => updateMatch({ ...m, date: new Date(e.target.value).toISOString() })} className="bg-transparent text-[7px] font-bold text-slate-400 outline-none" />
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </main>

      {/* MODALES */}
      {showShareMatch && <ShareCard match={showShareMatch} home={teams.find(t=>t.id===showShareMatch.homeTeamId)} away={teams.find(t=>t.id===showShareMatch.awayTeamId)} tournament={tournaments.find(t=>t.id===showShareMatch.tournamentId)} onClose={() => setShowShareMatch(null)} />}

      {selectedTeamId && (
        <Modal title="Gestión Plantilla" onClose={() => setSelectedTeamId(null)}>
           <div className="space-y-2">
              {teams.find(t=>t.id===selectedTeamId)!.players.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100 group">
                   <div className="flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm" alt="" />
                      <div><p className="font-oswald font-black text-blue-900 uppercase text-sm leading-none">#{p.number} {p.name}</p></div>
                   </div>
                   <div className="flex items-center gap-1">
                      <button onClick={() => setEditPlayerInfo({ teamId: selectedTeamId, playerId: p.id })} className="p-1.5 text-blue-600 bg-white shadow rounded-lg active:scale-125"><Edit3 size={12} /></button>
                      <button onClick={() => updateTeam({ ...teams.find(t=>t.id===selectedTeamId)!, captainId: p.id })} className={`p-1.5 rounded-lg active:scale-125 ${teams.find(t=>t.id===selectedTeamId)!.captainId === p.id ? 'text-amber-500' : 'text-slate-300'}`}><Star size={16} fill={teams.find(t=>t.id===selectedTeamId)!.captainId === p.id ? 'currentColor' : 'none'} /></button>
                      <button onClick={() => deletePlayer(selectedTeamId, p.id)} className="p-1.5 text-rose-500 bg-white shadow rounded-lg active:scale-125"><Trash2 size={12} /></button>
                   </div>
                </div>
              ))}
           </div>
        </Modal>
      )}

      {editPlayerInfo && (
        <Modal title="Editar Atleta" onClose={() => setEditPlayerInfo(null)}>
           <div className="space-y-4">
              <div onClick={() => (document.getElementById('edit-p-img') as any).click()} className="w-20 h-20 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center cursor-pointer group border-2 border-dashed border-slate-200 overflow-hidden">
                 <img src={tempImg || teams.find(t=>t.id===editPlayerInfo.teamId)?.players.find(p=>p.id===editPlayerInfo.playerId)?.image} className="w-full h-full object-cover" alt=""/>
                 <input type="file" id="edit-p-img" className="hidden" onChange={e=>handleFile(e, setTempImg)} />
              </div>
              <input id="edit-p-name" type="text" defaultValue={teams.find(t=>t.id===editPlayerInfo.teamId)?.players.find(p=>p.id===editPlayerInfo.playerId)?.name} className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold uppercase text-slate-900" />
              <button onClick={() => {
                const n = (document.getElementById('edit-p-name') as any).value;
                const p = teams.find(t=>t.id===editPlayerInfo.teamId)?.players.find(pr=>pr.id===editPlayerInfo.playerId);
                if(p) { updatePlayer(editPlayerInfo.teamId, { ...p, name: n, image: tempImg || p.image }); setTempImg(''); setEditPlayerInfo(null); }
              }} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[8px] font-black uppercase active:scale-110">GUARDAR CAMBIOS</button>
           </div>
        </Modal>
      )}

      {editTeamId && (
        <Modal title="Editar Equipo" onClose={() => setEditTeamId(null)}>
           <div className="space-y-4">
              <div onClick={() => (document.getElementById('edit-t-logo') as any).click()} className="w-24 h-24 bg-slate-50 border-2 border-dashed rounded-2xl mx-auto flex items-center justify-center cursor-pointer overflow-hidden">
                 <img src={tempLogo} className="w-full h-full object-contain" alt=""/>
                 <input type="file" id="edit-t-logo" className="hidden" onChange={e=>handleFile(e, setTempLogo)} />
              </div>
              <input id="edit-t-name" type="text" defaultValue={teams.find(t=>t.id===editTeamId)?.name} className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold uppercase text-slate-900" />
              <button onClick={() => {
                const n = (document.getElementById('edit-t-name') as any).value;
                const t = teams.find(te=>te.id===editTeamId);
                if(t) { updateTeam({ ...t, name: n, logo: tempLogo }); setTempLogo(''); setEditTeamId(null); }
              }} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[8px] font-black uppercase active:scale-110">GUARDAR</button>
           </div>
        </Modal>
      )}

      {addTournamentModal && (
        <Modal title="Nuevo Torneo" onClose={() => setAddTournamentModal(false)}>
           <div className="space-y-4">
              <div onClick={() => (document.getElementById('t-logo-file') as any).click()} className="w-24 h-24 bg-slate-50 border-2 border-dashed rounded-2xl mx-auto flex items-center justify-center cursor-pointer overflow-hidden group">
                 {tempLogo ? <img src={tempLogo} className="w-full h-full object-contain" alt=""/> : <ImageIcon size={24} className="text-slate-300"/>}
                 <input type="file" id="t-logo-file" className="hidden" onChange={e=>handleFile(e, setTempLogo)} />
              </div>
              <input id="tr-name" type="text" placeholder="Nombre del Torneo" className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold uppercase text-slate-900" />
              <button onClick={() => {
                const n = (document.getElementById('tr-name') as any).value;
                const sel = teams.map(t => t.id);
                if(n) { addTournament({ id: Math.random().toString(), name: n, logo: tempLogo || 'https://picsum.photos/400', teams: sel, groups: { "Pool Único": sel } }); setTempLogo(''); setAddTournamentModal(false); }
              }} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest active:scale-110">CREAR TORNEO</button>
           </div>
        </Modal>
      )}

      {addTeamModal && (
        <Modal title="Alta Equipo" onClose={() => setAddTeamModal(false)}>
           <div className="space-y-4">
              <div onClick={() => (document.getElementById('team-logo-f') as any).click()} className="w-24 h-24 bg-slate-50 border-2 border-dashed rounded-2xl mx-auto flex items-center justify-center cursor-pointer group">
                 {tempLogo ? <img src={tempLogo} className="w-full h-full object-contain" alt=""/> : <ImageIcon size={24} className="text-slate-300"/>}
                 <input type="file" id="team-logo-f" className="hidden" onChange={e=>handleFile(e, setTempLogo)} />
              </div>
              <div className="space-y-2">
                 <input id="new-t-name" type="text" placeholder="Nombre Equipo" className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold uppercase text-slate-900" />
                 <input id="new-t-del" type="text" placeholder="Delegado" className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold uppercase text-slate-900" />
              </div>
              <button onClick={() => {
                const n = (document.getElementById('new-t-name') as any).value;
                const d = (document.getElementById('new-t-del') as any).value;
                if(n) { addTeam({ id: Math.random().toString(), name: n, shortName: '', delegate: d, logo: tempLogo || 'https://picsum.photos/200', players: [], primaryColor: '#1e40af' }); setTempLogo(''); setAddTeamModal(false); }
              }} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[8px] font-black uppercase active:scale-110">REGISTRAR</button>
           </div>
        </Modal>
      )}

      {addPlayerTo && (
        <Modal title="Fichar Atleta" onClose={() => setAddPlayerTo(null)}>
           <div className="space-y-4">
              <div onClick={() => (document.getElementById('p-img-f') as any).click()} className="w-20 h-20 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center cursor-pointer group border-2 border-dashed border-slate-200 overflow-hidden">
                 {tempImg ? <img src={tempImg} className="w-full h-full object-cover" alt=""/> : <Camera size={24} className="text-slate-300"/>}
                 <input type="file" id="p-img-f" className="hidden" onChange={e=>handleFile(e, setTempImg)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <input id="np-name" type="text" placeholder="Nombre" className="w-full border bg-slate-50 p-3 rounded-xl text-[10px] font-bold uppercase text-slate-900 col-span-2" />
                 <input id="np-num" type="number" placeholder="Dorsal" className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold text-slate-900" />
                 <select id="np-pos" className="w-full border bg-slate-50 p-3 rounded-xl text-[8px] font-black uppercase text-slate-900">
                    <option value="OH">Punta</option><option value="OPP">Opuesto</option><option value="MB">Central</option><option value="S">Armador</option><option value="L">Libero</option>
                 </select>
              </div>
              <button onClick={() => {
                const n = (document.getElementById('np-name') as any).value;
                const num = (document.getElementById('np-num') as any).value;
                const pos = (document.getElementById('np-pos') as any).value;
                const t = teams.find(tm=>tm.id===addPlayerTo);
                if(n && num && t) { updateTeam({ ...t, players: [...t.players, { id: Math.random().toString(), name: n, number: parseInt(num), position: pos, image: tempImg || 'https://i.pravatar.cc/300', stats: { points: 0, aces: 0, blocks: 0, attacks: 0, errors: 0 } }] }); setTempImg(''); setAddPlayerTo(null); }
              }} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[8px] font-black uppercase active:scale-110">CONFIRMAR</button>
           </div>
        </Modal>
      )}

      {addUserModal && (
        <Modal title="Nuevo Acceso" onClose={() => setAddUserModal(false)}>
           <div className="space-y-4">
              <input id="un" type="text" placeholder="Nombre" className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold text-slate-900" />
              <input id="uu" type="text" placeholder="Usuario" className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold text-slate-900" />
              <input id="up" type="password" placeholder="Clave" className="w-full border bg-slate-50 p-3 rounded-xl text-xs font-bold text-slate-900" />
              <select id="ur" className="w-full border bg-slate-50 p-3 rounded-xl text-[8px] font-black uppercase text-slate-900">
                 <option value="REFEREE">Árbitro</option><option value="COACH">Entrenador</option><option value="SPECTATOR">Espectador</option>
              </select>
              <button onClick={() => {
                const n = (document.getElementById('un') as any).value;
                const u = (document.getElementById('uu') as any).value;
                const p = (document.getElementById('up') as any).value;
                const r = (document.getElementById('ur') as any).value;
                if(n && u && p) { addUser({ id: Math.random().toString(), name: n, username: u, password: p, role: r as UserRole }); setAddUserModal(false); }
              }} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[8px] font-black uppercase active:scale-110">CREAR</button>
           </div>
        </Modal>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const App = () => (
  <TournamentProvider>
    <AppContent />
  </TournamentProvider>
);

export default App;
