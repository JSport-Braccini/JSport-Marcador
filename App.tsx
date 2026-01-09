
import React, { useState, useRef, useEffect } from 'react';
import { TournamentProvider, useTournament } from './store/TournamentContext';
import { UserRole, Team, Player, Tournament, Match, User, Rotation } from './types';
import VNLMainScoreboard from './components/Overlay/VNLMainScoreboard';
import MiniBug from './components/Overlay/MiniBug';
import ChallengeReplay from './components/Overlay/ChallengeReplay';
import MatchControl from './components/Admin/MatchControl';
import StatsOverlay from './components/Overlay/StatsOverlay';
import { 
  Volleyball, Users, Trophy, PlayCircle, LogOut, 
  UserCheck, Lock, UserPlus, Trash2, LayoutGrid, 
  MonitorPlay, Plus, Image as ImageIcon, X, Edit3, Camera, ExternalLink, ShieldCheck,
  RefreshCcw, User as UserIcon, Calendar, Save, Share2, Download, Star, Eye, EyeOff, MessageCircle
} from 'lucide-react';

const NavIcon = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <Icon size={20} />
    <span className={`absolute -bottom-6 text-[8px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100 text-blue-500' : ''}`}>{label}</span>
  </button>
);

const Modal = ({ title, children, onClose }: { title: string, children?: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
    <div className="bg-white border border-slate-200 w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in text-slate-900">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-xl font-oswald font-bold uppercase text-blue-900">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
      </div>
      <div className="p-8 max-h-[85vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);

const ShareCard = ({ match, home, away, tournament, onClose }: any) => {
  const homeCaptain = home.players.find((p: any) => p.id === home.captainId) || home.players[0];
  const awayCaptain = away.players.find((p: any) => p.id === away.captainId) || away.players[0];

  const shareToWhatsApp = () => {
    const text = `🔥 ¡Sigue el partido en VIVO! 🔥\n🏐 ${home.name} vs ${away.name}\n🏆 ${tournament.name}\n📅 ${new Date(match.date).toLocaleDateString()} a las ${new Date(match.date).toLocaleTimeString()}\n📲 ¡No te lo pierdas en JSPORT!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Modal title="Game Day Share" onClose={onClose}>
      <div className="space-y-8">
        <div id="share-card" className="relative aspect-[9/16] w-full bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col items-center group border-[4px] border-white/5">
          {/* Sports Background with dynamic lines */}
          <div className="absolute inset-0 bg-slate-950">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-slate-950 to-emerald-900/20 opacity-90" />
             {/* Diagonal lines */}
             <div className="absolute inset-0 opacity-10 flex flex-col justify-between p-4 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => <div key={i} className="w-[200%] h-px bg-white rotate-[-35deg] transform origin-left" style={{ marginBottom: '40px' }} />)}
             </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center w-full h-full justify-between py-10 px-6">
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="bg-blue-600/20 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 flex items-center gap-3">
                <img src={tournament?.logo} className="h-5 w-5 object-contain filter brightness-0 invert" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/90">{tournament?.name}</span>
              </div>
              <h2 className="text-5xl font-oswald font-black italic tracking-tighter text-white uppercase mt-4 text-center">EL DUELO <span className="text-amber-400">ESTELAR</span></h2>
            </div>

            <div className="w-full flex justify-between items-center relative">
               <div className="flex flex-col items-center flex-1">
                 <img src={home.logo} className="h-24 w-24 object-contain bg-white rounded-3xl p-4 shadow-2xl border border-white/10" />
                 <h3 className="font-oswald text-2xl font-black uppercase text-white mt-4">{home.shortName}</h3>
               </div>
               <div className="bg-slate-900 border-2 border-amber-400 w-12 h-12 rounded-full flex items-center justify-center font-oswald text-2xl font-black italic text-amber-400 shadow-2xl z-10">VS</div>
               <div className="flex flex-col items-center flex-1">
                 <img src={away.logo} className="h-24 w-24 object-contain bg-white rounded-3xl p-4 shadow-2xl border border-white/10" />
                 <h3 className="font-oswald text-2xl font-black uppercase text-white mt-4">{away.shortName}</h3>
               </div>
            </div>

            {/* Visual Centerpiece */}
            <div className="relative w-full h-[30%] flex justify-center items-end mt-4">
               {homeCaptain && (
                 <div className="relative z-20 transform -rotate-3 translate-x-10 hover:rotate-0 transition-transform duration-500">
                    <img src={homeCaptain.image} className="w-36 h-48 object-cover rounded-2xl border-2 border-white shadow-2xl" />
                    <div className="absolute -bottom-2 -left-2 bg-blue-600 px-3 py-1 rounded-lg text-[7px] font-black uppercase border border-white shadow-lg">#{homeCaptain.number}</div>
                 </div>
               )}
               {awayCaptain && (
                 <div className="relative z-10 transform rotate-3 -translate-x-10 opacity-70 filter grayscale-[0.3]">
                    <img src={awayCaptain.image} className="w-36 h-48 object-cover rounded-2xl border-2 border-white/20 shadow-xl" />
                 </div>
               )}
            </div>

            <div className="w-full space-y-4 pt-10 text-center relative z-10">
               <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 inline-block w-full">
                 <div className="flex items-center justify-center gap-3 text-amber-400 mb-1">
                   <Calendar size={14} />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">{new Date(match.date).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()}</span>
                 </div>
                 <p className="text-4xl font-oswald font-black text-white">{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} HRS</p>
               </div>
            </div>

            <div className="w-full px-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Volleyball size={16} className="text-white" /></div>
                <h2 className="text-xl font-oswald font-bold text-white leading-none">J<span className="text-blue-500">SPORT</span></h2>
              </div>
              <div className="text-[6px] font-black uppercase tracking-[0.4em] text-slate-500">Transmisión Exclusiva</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <button className="flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase text-xs hover:bg-slate-800 transition-all border border-white/5 shadow-xl">
             <Download size={20} /> Guardar
           </button>
           <button onClick={shareToWhatsApp} className="flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white rounded-2xl font-bold uppercase text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
             <MessageCircle size={20} /> WhatsApp
           </button>
        </div>
      </div>
    </Modal>
  );
};

const LoginForm = () => {
  const { setCurrentUser, users } = useTournament();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    if (username === 'admin' && password === 'admin') {
      setCurrentUser({ id: 'u1', username: 'admin', name: 'Administrador', role: 'ADMIN' });
    } else if (user && user.password === password) {
      setCurrentUser(user);
    } else {
      setError('Credenciales de seguridad incorrectas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(circle_at_top_right,_#1e3a8a_0%,_#0f172a_100%)] p-6 text-slate-900">
      <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-2xl space-y-10 animate-fade-in relative overflow-hidden">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-[1.8rem] flex items-center justify-center shadow-2xl rotate-3">
              <Volleyball size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-oswald font-black tracking-tighter text-blue-900 uppercase">J<span className="text-blue-500">SPORT</span></h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.5em] mt-2">Professional Voley System</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Account ID</label>
               <div className="relative">
                 <UserCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                 <input type="text" placeholder="admin" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 pl-14 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-medium" />
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Security Password</label>
               <div className="relative">
                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                 <input type={showPass ? "text" : "password"} placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 pl-14 pr-14 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-medium" />
                 <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
               </div>
             </div>
          </div>
          {error && <p className="text-rose-500 text-[10px] font-black text-center uppercase tracking-wider">{error}</p>}
          <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-sm shadow-xl shadow-blue-600/30 transition-all">Authenticate</button>
        </form>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { 
    currentUser, setCurrentUser, matches, teams, tournaments, users,
    removeUser, addUser, updateUser, addTeam, updateTeam, addTournament, 
    removeTournament, createFixture, removeMatch, updateMatch, deletePlayer, updatePlayer, toggleServerOverlay
  } = useTournament();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const playerFileRef = useRef<HTMLInputElement>(null);
  const trnFileRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('LIVE');
  const [showChallenge, setShowChallenge] = useState(false);
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddTournament, setShowAddTournament] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState<Team | null>(null);
  const [editPlayer, setEditPlayer] = useState<{ teamId: string, player: Player } | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editMatchDate, setEditMatchDate] = useState<Match | null>(null);
  const [showShareModal, setShowShareModal] = useState<Match | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);

  const [tempLogo, setTempLogo] = useState<string>('');
  const [tempPlayerImage, setTempPlayerImage] = useState<string>('');
  const [tempTrnLogo, setTempTrnLogo] = useState<string>('');
  const [overlays, setOverlays] = useState({ scoreboard: true, minibug: true });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const liveMatch = matches.find(m => m.id === activeMatchId) || matches.find(m => m.status === 'LIVE') || (matches.length > 0 ? matches[0] : null);
  const home = liveMatch ? teams.find(t => t.id === liveMatch.homeTeamId) : null;
  const away = liveMatch ? teams.find(t => t.id === liveMatch.awayTeamId) : null;
  const tournament = liveMatch ? tournaments.find(t => t.id === liveMatch.tournamentId) : null;

  if (!currentUser) return <LoginForm />;

  if (isBroadcastMode && liveMatch && home && away && tournament) {
    return (
      <div className="fixed inset-0 bg-black z-[200] overflow-hidden">
        <img src="https://picsum.photos/1920/1080?random=broadcast" className="w-full h-full object-cover opacity-80" />
        {overlays.minibug && <MiniBug match={liveMatch} home={home} away={away} tournament={tournament} />}
        {overlays.scoreboard && <VNLMainScoreboard match={liveMatch} homeTeam={home} awayTeam={away} tournament={tournament} />}
        {liveMatch.activeOverlay && <StatsOverlay match={liveMatch} home={home} away={away} view={liveMatch.activeOverlay} />}
        <ChallengeReplay isOpen={showChallenge} onClose={() => setShowChallenge(false)} />
        <button onClick={() => setIsBroadcastMode(false)} className="absolute top-6 right-6 p-4 bg-slate-900/50 text-white rounded-full hover:bg-amber-400 transition-all opacity-0 hover:opacity-100"><MonitorPlay size={24} /></button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md"><Volleyball size={24} className="text-white" /></div><h2 className="text-2xl font-oswald font-bold tracking-tight text-blue-900">J<span className="text-blue-500">SPORT</span></h2></div>
          <div className="flex items-center gap-2">
            <NavIcon icon={PlayCircle} label="Live" active={activeTab === 'LIVE'} onClick={() => setActiveTab('LIVE')} />
            <NavIcon icon={Users} label="Equipos" active={activeTab === 'TEAMS'} onClick={() => setActiveTab('TEAMS')} />
            <NavIcon icon={Trophy} label="Torneos" active={activeTab === 'TOURNAMENTS'} onClick={() => setActiveTab('TOURNAMENTS')} />
            {currentUser.role === 'ADMIN' && <NavIcon icon={ShieldCheck} label="Usuarios" active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')} />}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsBroadcastMode(true)} className="px-6 py-2.5 bg-blue-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10"><MonitorPlay size={16} /> Broadcast</button>
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
             <div className="text-right"><p className="text-xs font-black uppercase text-blue-900">{currentUser.name}</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{currentUser.role}</p></div>
             <button onClick={() => setCurrentUser(null)} className="p-3 text-slate-300 hover:text-rose-500 transition-all"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'LIVE' && liveMatch && home && away && tournament ? (
          <div className="grid grid-cols-12 gap-8 animate-fade-in">
            <div className="col-span-12">
              <MatchControl match={liveMatch} onChallenge={() => setShowChallenge(true)} />
            </div>
          </div>
        ) : activeTab === 'LIVE' ? (
           <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner"><PlayCircle size={64} className="text-slate-100 mb-6" /><p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] text-center">Inicia un encuentro desde la pestaña Torneos.</p></div>
        ) : null}

        {activeTab === 'TEAMS' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center"><h3 className="text-3xl font-oswald font-bold text-blue-900 uppercase tracking-tighter">Equipos</h3><button onClick={() => setShowAddTeam(true)} className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl flex items-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"><Plus size={18} /> Nuevo Equipo</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teams.map(team => (
                <div key={team.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-6 mb-8">
                    <img src={team.logo} className="w-24 h-16 object-contain rounded-2xl bg-slate-50 border p-2" />
                    <div><h4 className="text-2xl font-oswald font-bold text-blue-900 uppercase leading-none">{team.name}</h4><span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">{team.shortName}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setSelectedTeam(team)} className="py-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 text-[10px] font-black uppercase rounded-2xl transition-all">Plantilla ({team.players.length})</button>
                    <button onClick={() => setShowAddPlayer(team)} className="py-4 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase rounded-2xl transition-all">Añadir Jugador</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center"><h3 className="text-3xl font-oswald font-bold text-blue-900 uppercase tracking-tighter">Personal Autorizado</h3><button onClick={() => setShowAddUser(true)} className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl flex items-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"><UserPlus size={18} /> Nuevo Usuario</button></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {users.map(u => (
                  <div key={u.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center group shadow-sm hover:shadow-md transition-all">
                    <div><p className="font-black text-blue-900 uppercase text-base">{u.name}</p><p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{u.role} | @{u.username}</p></div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => setEditUser(u)} className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl"><Edit3 size={18}/></button>
                       {u.id !== 'u1' && <button onClick={() => removeUser(u.id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 size={18}/></button>}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'TOURNAMENTS' && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center"><h3 className="text-3xl font-oswald font-bold text-blue-900 uppercase tracking-tighter">Campeonatos</h3><button onClick={() => setShowAddTournament(true)} className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl flex items-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"><Trophy size={18} /> Abrir Torneo</button></div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {tournaments.map(t => (
                 <div key={t.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                   <div className="flex justify-between items-start mb-10">
                      <div className="flex items-center gap-6"><img src={t.logo} className="w-20 h-20 object-contain rounded-[2rem] border-2 border-slate-50 bg-white p-3 shadow-sm" /><div><h4 className="text-3xl font-oswald font-bold text-blue-900 uppercase leading-none tracking-tight">{t.name}</h4><p className="text-[10px] text-slate-400 font-bold uppercase mt-3 tracking-widest">{t.teams.length} Equipos Inscritos</p></div></div>
                      <button onClick={() => removeTournament(t.id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-[1.5rem] transition-all"><Trash2 size={24}/></button>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2 items-center"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fixture Oficial</span><button onClick={() => createFixture(t.id, t.groups)} className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider">Lanzar Sorteo</button></div>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scroll">
                        {matches.filter(m => m.tournamentId === t.id).map(match => (
                          <div key={match.id} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group/item hover:bg-white hover:shadow-md transition-all">
                             <div className="flex items-center gap-6"><span className="font-oswald font-black text-xl text-blue-900 w-12 text-center">{teams.find(tm => tm.id === match.homeTeamId)?.shortName}</span><span className="text-[10px] text-slate-300 font-black">VS</span><span className="font-oswald font-black text-xl text-blue-900 w-12 text-center">{teams.find(tm => tm.id === match.awayTeamId)?.shortName}</span></div>
                             <div className="flex items-center gap-4">
                               <div className="flex flex-col items-end">
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{new Date(match.date).toLocaleDateString()}</span>
                                 <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">{match.status}</span>
                               </div>
                               <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                                  <button onClick={() => setEditMatchDate(match)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl" title="Calendario"><Calendar size={18}/></button>
                                  <button onClick={() => setShowShareModal(match)} className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl" title="Compartir Social"><Share2 size={18}/></button>
                                  <button onClick={() => { setActiveMatchId(match.id); setActiveTab('LIVE'); }} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl" title="Gestionar Match"><ExternalLink size={18}/></button>
                                  <button onClick={() => removeMatch(match.id)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 size={18}/></button>
                               </div>
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

      {/* MODALS */}
      {showShareModal && (
        <ShareCard 
          match={showShareModal}
          home={teams.find(t => t.id === showShareModal.homeTeamId)}
          away={teams.find(t => t.id === showShareModal.awayTeamId)}
          tournament={tournaments.find(t => t.id === showShareModal.tournamentId)}
          onClose={() => setShowShareModal(null)}
        />
      )}

      {editMatchDate && (
        <Modal title="Editar Programación" onClose={() => setEditMatchDate(null)}>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Nueva Fecha de Encuentro</label>
                 <input type="datetime-local" id="new-match-date" defaultValue={editMatchDate.date.slice(0, 16)} className="w-full bg-slate-50 border p-5 rounded-2xl outline-none text-slate-900 font-bold" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => {
                  const newDate = (document.getElementById('new-match-date') as HTMLInputElement).value;
                  updateMatch({ ...editMatchDate, date: new Date(newDate).toISOString() });
                  setEditMatchDate(null);
                }} className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                  <Save size={20} /> Actualizar Calendario
                </button>
              </div>
           </div>
        </Modal>
      )}

      {selectedTeam && (
        <Modal title={`Gestión Plantilla - ${selectedTeam.name}`} onClose={() => setSelectedTeam(null)}>
           <div className="space-y-4">
              {selectedTeam.players.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-3xl border border-slate-100 group shadow-sm">
                   <div className="flex items-center gap-5">
                      <img src={p.image} className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md" />
                      <div className="flex items-center gap-3">
                        <div><p className="font-black text-blue-900 uppercase text-lg">#{p.number} {p.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.position}</p></div>
                        {selectedTeam.captainId === p.id && <div className="bg-blue-900 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20">CAPITÁN</div>}
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={() => updateTeam({ ...selectedTeam, captainId: p.id })} className={`p-3 rounded-2xl transition-all ${selectedTeam.captainId === p.id ? 'bg-amber-100 text-amber-500' : 'bg-white border text-slate-300 hover:text-amber-500'}`} title="Hacer Capitán"><Star size={20} fill={selectedTeam.captainId === p.id ? 'currentColor' : 'none'} /></button>
                      <button onClick={() => { setEditPlayer({ teamId: selectedTeam.id, player: p }); }} className="p-3 text-blue-500 bg-white border rounded-2xl hover:bg-blue-50"><Edit3 size={20}/></button>
                      <button onClick={() => deletePlayer(selectedTeam.id, p.id)} className="p-3 text-rose-500 bg-white border rounded-2xl hover:bg-rose-50"><Trash2 size={20}/></button>
                   </div>
                </div>
              ))}
           </div>
        </Modal>
      )}

      {showAddUser && (
        <Modal title="Registro de Nuevo Usuario" onClose={() => setShowAddUser(false)}>
           <div className="space-y-5">
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Nombre Completo</label>
                 <input id="u-name" type="text" placeholder="ej. Carlos Pérez" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none text-slate-900 font-bold" />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Nombre de Usuario</label>
                 <input id="u-user" type="text" placeholder="ej. cperez" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none text-slate-900 font-bold" />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Contraseña de Acceso</label>
                 <input id="u-pass" type="password" placeholder="••••••••" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none text-slate-900 font-bold" />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Rol del Sistema</label>
                 <select id="u-role" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none text-slate-900 font-bold appearance-none">
                    <option value="COACH">Entrenador</option><option value="REFEREE">Árbitro</option><option value="ADMIN">Administrador</option><option value="SPECTATOR">Espectador</option>
                 </select>
              </div>
              <button onClick={() => {
                const n = (document.getElementById('u-name') as HTMLInputElement).value;
                const u = (document.getElementById('u-user') as HTMLInputElement).value;
                const p = (document.getElementById('u-pass') as HTMLInputElement).value;
                const r = (document.getElementById('u-role') as HTMLSelectElement).value;
                if(n && u && p) { addUser({ id: Math.random().toString(), name: n, username: u, password: p, role: r as any }); setShowAddUser(false); }
              }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs shadow-xl active:scale-95 transition-all mt-4">Crear Perfil de Acceso</button>
           </div>
        </Modal>
      )}

      {editUser && (
        <Modal title="Actualizar Perfil" onClose={() => setEditUser(null)}>
           <div className="space-y-5">
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Nombre Completo</label>
                 <input id="eu-name" type="text" defaultValue={editUser.name} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none text-slate-900 font-bold" />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Nueva Contraseña</label>
                 <input id="eu-pass" type="password" defaultValue={editUser.password} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none text-slate-900 font-bold" />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Rol en Sistema</label>
                 <select id="eu-role" defaultValue={editUser.role} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none text-slate-900 font-bold">
                    <option value="COACH">Entrenador</option><option value="REFEREE">Árbitro</option><option value="ADMIN">Administrador</option><option value="SPECTATOR">Espectador</option>
                 </select>
              </div>
              <button onClick={() => {
                const n = (document.getElementById('eu-name') as HTMLInputElement).value;
                const p = (document.getElementById('eu-pass') as HTMLInputElement).value;
                const r = (document.getElementById('eu-role') as HTMLSelectElement).value;
                updateUser({ ...editUser, name: n, password: p, role: r as any });
                setEditUser(null);
              }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs shadow-lg active:scale-95 transition-all">Guardar Cambios</button>
           </div>
        </Modal>
      )}

      {showAddTeam && (
        <Modal title="Registro de Entidad" onClose={() => setShowAddTeam(false)}>
           <div className="space-y-6 text-slate-900">
              <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-4 p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                 {tempLogo ? <img src={tempLogo} className="w-32 h-20 object-contain shadow-2xl rounded-2xl" /> : <ImageIcon size={48} className="text-slate-200" />}
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Escudo Oficial (PNG)</p>
                 <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, setTempLogo)} />
              </div>
              <div className="space-y-4">
                <input id="t-name" type="text" placeholder="Nombre del Equipo" className="w-full bg-slate-50 border p-5 rounded-2xl outline-none text-slate-900 font-bold" />
                <input id="t-del" type="text" placeholder="Delegado a Cargo" className="w-full bg-slate-50 border p-5 rounded-2xl outline-none text-slate-900 font-bold" />
              </div>
              <button onClick={() => {
                const n = (document.getElementById('t-name') as HTMLInputElement).value;
                const d = (document.getElementById('t-del') as HTMLInputElement).value;
                if(n) {
                  addTeam({ id: Math.random().toString(), name: n, shortName: '', delegate: d, logo: tempLogo || 'https://picsum.photos/200/200', players: [], primaryColor: '#1e40af' });
                  setTempLogo(''); setShowAddTeam(false);
                }
              }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs shadow-xl active:scale-95 transition-all">Registrar Equipo</button>
           </div>
        </Modal>
      )}

      {showAddPlayer && (
        <Modal title={`Nuevo Atleta - ${showAddPlayer.name}`} onClose={() => setShowAddPlayer(null)}>
           <div className="space-y-6">
              <div onClick={() => playerFileRef.current?.click()} className="flex flex-col items-center gap-4 p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                 {tempPlayerImage ? <img src={tempPlayerImage} className="w-24 h-24 rounded-[1.5rem] object-cover border-4 border-white shadow-2xl" /> : <Camera size={48} className="text-slate-200" />}
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fotografía Perfil</p>
                 <input type="file" ref={playerFileRef} className="hidden" onChange={(e) => handleFileUpload(e, setTempPlayerImage)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <input id="p-name" type="text" placeholder="Nombre" className="w-full bg-slate-50 border p-5 rounded-2xl outline-none text-slate-900 font-bold" />
                 <input id="p-num" type="number" placeholder="Dorsal #" className="w-full bg-slate-50 border p-5 rounded-2xl outline-none text-slate-900 font-bold" />
                 <select id="p-pos" className="w-full bg-slate-50 border p-5 rounded-2xl outline-none text-slate-900 font-bold col-span-2 appearance-none">
                    <option value="OH">Punta</option><option value="OPP">Opuesto</option><option value="MB">Central</option><option value="S">Armador</option><option value="L">Libero</option>
                 </select>
              </div>
              <button onClick={() => {
                const n = (document.getElementById('p-name') as HTMLInputElement).value;
                const num = (document.getElementById('p-num') as HTMLInputElement).value;
                const pos = (document.getElementById('p-pos') as HTMLSelectElement).value;
                if(n && num) {
                  const newPlayer: Player = { id: Math.random().toString(), name: n, number: parseInt(num), position: pos as any, image: tempPlayerImage || 'https://i.pravatar.cc/150', stats: { points: 0, aces: 0, blocks: 0, attacks: 0, errors: 0 }};
                  updateTeam({ ...showAddPlayer, players: [...showAddPlayer.players, newPlayer] });
                  setTempPlayerImage(''); setShowAddPlayer(null);
                }
              }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs active:scale-95 transition-all">Fichar Jugador</button>
           </div>
        </Modal>
      )}

      {showAddTournament && (
        <Modal title="Abrir Nuevo Campeonato" onClose={() => setShowAddTournament(false)}>
           <div className="space-y-6">
              <div onClick={() => trnFileRef.current?.click()} className="flex flex-col items-center gap-4 p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                 {tempTrnLogo ? <img src={tempTrnLogo} className="w-32 h-32 object-contain shadow-2xl rounded-2xl" /> : <Trophy size={48} className="text-slate-200" />}
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logo Oficial Torneo</p>
                 <input type="file" ref={trnFileRef} className="hidden" onChange={(e) => handleFileUpload(e, setTempTrnLogo)} />
              </div>
              <input id="tr-name" type="text" placeholder="Nombre de la Competición" className="w-full bg-slate-50 border p-5 rounded-2xl outline-none text-slate-900 font-bold" />
              <div className="space-y-3">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-4">Equipos Invitados</p>
                 <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scroll">
                    {teams.map(t => (
                      <label key={t.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white transition-all">
                         <input type="checkbox" name="tr-teams" value={t.id} className="w-5 h-5 accent-blue-600 rounded-lg" />
                         <span className="text-xs font-black uppercase text-slate-900">{t.name}</span>
                      </label>
                    ))}
                 </div>
              </div>
              <button onClick={() => {
                const n = (document.getElementById('tr-name') as HTMLInputElement).value;
                const checks = document.getElementsByName('tr-teams') as any;
                const selected = Array.from(checks).filter((c:any) => c.checked).map((c:any) => c.value);
                if(n && selected.length > 0) {
                  addTournament({ id: Math.random().toString(), name: n, logo: tempTrnLogo || 'https://picsum.photos/200/200', teams: selected, groups: { "Pool Único": selected } });
                  setTempTrnLogo(''); setShowAddTournament(false);
                }
              }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs active:scale-95 transition-all mt-4 shadow-xl">Crear Torneo</button>
           </div>
        </Modal>
      )}
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
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
