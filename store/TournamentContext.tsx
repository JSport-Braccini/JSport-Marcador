
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tournament, Team, Match, User, Player, Rotation } from '../types';

interface TournamentContextType {
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  removeTeam: (id: string) => void;
  addTournament: (tournament: Tournament) => void;
  removeTournament: (id: string) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (id: string) => void;
  updateMatch: (match: Match) => void;
  removeMatch: (id: string) => void;
  toggleServerOverlay: (matchId: string, show: boolean) => void;
  createFixture: (tournamentId: string, groups: { [key: string]: string[] }) => void;
  registerPoint: (matchId: string, teamSide: 'home' | 'away', playerId: string, action: 'attack' | 'block' | 'ace' | 'error') => void;
  deletePlayer: (teamId: string, playerId: string) => void;
  updatePlayer: (teamId: string, player: Player) => void;
  rotateTeam: (matchId: string, teamSide: 'home' | 'away') => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', username: 'admin', name: 'Admin Central', role: 'ADMIN', password: 'admin' },
    { id: 'u2', username: 'arbitro', name: 'Arbitro Pro', role: 'REFEREE', password: '123' },
    { id: 'u3', username: 'coach', name: 'Entrenador A', role: 'COACH', password: '123' },
    { id: 'u4', username: 'fan', name: 'Espectador', role: 'SPECTATOR', password: '123' }
  ]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const addTeam = (team: Team) => {
    const autoShort = team.name.substring(0, 3).toUpperCase();
    setTeams(prev => [...prev, { ...team, shortName: autoShort }]);
  };

  const updateTeam = (team: Team) => setTeams(prev => prev.map(t => t.id === team.id ? team : t));
  const removeTeam = (id: string) => setTeams(prev => prev.filter(t => t.id !== id));
  
  const addTournament = (tournament: Tournament) => setTournaments(prev => [...prev, tournament]);
  const removeTournament = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    setMatches(prev => prev.filter(m => m.tournamentId !== id));
  };
  
  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const updateUser = (user: User) => setUsers(prev => prev.map(u => u.id === user.id ? user : u));
  const removeUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  
  const updateMatch = (match: Match) => setMatches(prev => prev.map(m => m.id === match.id ? match : m));
  const removeMatch = (id: string) => setMatches(prev => prev.filter(m => m.id !== id));

  const toggleServerOverlay = (matchId: string, show: boolean) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, showServerOverlay: show } : m));
  };

  const deletePlayer = (teamId: string, playerId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, players: t.players.filter(p => p.id !== playerId) };
      }
      return t;
    }));
  };

  const updatePlayer = (teamId: string, player: Player) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, players: t.players.map(p => p.id === player.id ? player : p) };
      }
      return t;
    }));
  };

  const rotateTeam = (matchId: string, teamSide: 'home' | 'away') => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const rot = m.rotations[teamSide];
      const newRot: Rotation = { p1: rot.p2, p2: rot.p3, p3: rot.p4, p4: rot.p5, p5: rot.p6, p6: rot.p1 };
      return { 
        ...m, 
        rotations: { ...m.rotations, [teamSide]: newRot },
        servingPlayerId: m.servingSide === teamSide ? newRot.p1 : m.servingPlayerId
      };
    }));
  };

  const createFixture = (tournamentId: string, groups: { [key: string]: string[] }) => {
    const newMatches: Match[] = [];
    Object.entries(groups).forEach(([groupName, teamIds]) => {
      for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
          newMatches.push({
            id: `m-${Math.random().toString(36).substr(2, 9)}`,
            tournamentId, homeTeamId: teamIds[i], awayTeamId: teamIds[j],
            date: new Date().toISOString(), status: 'PENDING',
            setsWon: { home: 0, away: 0 }, currentSet: 1,
            scores: [{ home: 0, away: 0 }], group: groupName,
            servingSide: null, servingPlayerId: null, showScoreboard: true, showMiniBug: true,
            rotations: { 
              home: { p1: '', p2: '', p3: '', p4: '', p5: '', p6: '' }, 
              away: { p1: '', p2: '', p3: '', p4: '', p5: '', p6: '' } 
            }
          });
        }
      }
    });
    setMatches(prev => [...prev, ...newMatches]);
  };

  const registerPoint = (matchId: string, teamSide: 'home' | 'away', playerId: string, action: 'attack' | 'block' | 'ace' | 'error') => {
    setMatches(prevMatches => {
      const idx = prevMatches.findIndex(m => m.id === matchId);
      if (idx === -1) return prevMatches;
      const match = { ...prevMatches[idx] };
      if (match.status !== 'LIVE') return prevMatches;

      const newScores = [...match.scores];
      const currentScore = { ...newScores[match.currentSet - 1] };
      const winnerSide = action === 'error' ? (teamSide === 'home' ? 'away' : 'home') : teamSide;
      
      currentScore[winnerSide] += 1;
      newScores[match.currentSet - 1] = currentScore;
      match.scores = newScores;

      // Rotate if side-out
      if (match.servingSide !== winnerSide && match.servingSide !== null) {
        const rot = match.rotations[winnerSide];
        const newRot: Rotation = { p1: rot.p2, p2: rot.p3, p3: rot.p4, p4: rot.p5, p5: rot.p6, p6: rot.p1 };
        match.rotations = { ...match.rotations, [winnerSide]: newRot };
        match.servingPlayerId = newRot.p1;
      } else if (match.servingSide === null) {
        match.servingPlayerId = match.rotations[winnerSide].p1 || playerId;
      }
      match.servingSide = winnerSide;

      // Correctly update player stats
      setTeams(prev => prev.map(t => {
        const isPlayerTeam = (teamSide === 'home' && t.id === match.homeTeamId) || (teamSide === 'away' && t.id === match.awayTeamId);
        if (!isPlayerTeam) return t;
        
        return {
          ...t,
          players: t.players.map(p => {
            if (p.id !== playerId) return p;
            const s = { ...p.stats };
            if (action === 'attack') s.attacks++;
            if (action === 'block') s.blocks++;
            if (action === 'ace') s.aces++;
            if (action === 'error') s.errors++;
            if (action !== 'error') s.points++;
            return { ...p, stats: s };
          })
        };
      }));

      const next = [...prevMatches];
      next[idx] = match;
      return next;
    });
  };

  return (
    <TournamentContext.Provider value={{ 
      tournaments, teams, matches, users, currentUser, setCurrentUser, 
      addTeam, updateTeam, removeTeam, addTournament, removeTournament, addUser, updateUser, removeUser, 
      updateMatch, removeMatch, toggleServerOverlay, createFixture, registerPoint, deletePlayer, updatePlayer, rotateTeam
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) throw new Error('useTournament must be used within TournamentProvider');
  return context;
};
