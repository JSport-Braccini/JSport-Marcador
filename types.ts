
export type UserRole = 'ADMIN' | 'COACH' | 'REFEREE' | 'SPECTATOR';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  password?: string;
}

export interface PlayerStats {
  points: number;
  aces: number;
  blocks: number;
  attacks: number;
  errors: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'OH' | 'OPP' | 'MB' | 'S' | 'L';
  image: string; // Base64 local data
  stats: PlayerStats;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string; // Base64 local data
  delegate: string;
  players: Player[];
  primaryColor: string;
  captainId?: string;
}

export interface SetScore {
  home: number;
  away: number;
}

export interface Rotation {
  p1: string; // Player ID (Server)
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  setsWon: { home: number; away: number };
  currentSet: number;
  scores: SetScore[];
  group?: string;
  servingSide: 'home' | 'away' | null;
  servingPlayerId: string | null;
  showServerOverlay?: boolean;
  showScoreboard?: boolean;
  showMiniBug?: boolean;
  showReplay?: boolean;
  activeOverlay?: 'MATCH_STATS' | 'SET_STATS' | 'ROTATION_HOME' | 'ROTATION_AWAY' | null;
  rotations: {
    home: Rotation;
    away: Rotation;
  };
}

export interface Tournament {
  id: string;
  name: string;
  logo: string; // Base64 local data
  teams: string[];
  groups: { [key: string]: string[] };
}
