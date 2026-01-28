import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'candidate' | 'hr' | 'admin';
  name: string;
  lastLogin: number;
  lastAction: number;
  totalSessions: number;
}

export interface HistoryEntry {
  id: number;
  userId: number;
  filename: string;
  role: string | null;
  score: number | null;
  status: 'uploaded' | 'analyzed' | 'shortlisted' | 'rejected';
  uploadedAt: number;
  analyzedAt?: number;
  hrActionAt?: number;
  jdMatch?: number;
  confidence?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  reasoning?: string[];
}

export interface ActivityLogEntry {
  id: number;
  user: string;
  action: string;
  timestamp: number;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  history: HistoryEntry[];
  activityLog: ActivityLogEntry[];
  login: (email: string, password: string) => User | null;
  logout: () => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id'>) => number;
  updateHistoryStatus: (id: number, newStatus: HistoryEntry['status'], data?: Partial<HistoryEntry>) => void;
  getUserHistory: (userId: number) => HistoryEntry[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUsers: User[] = [
  { id: 1, email: 'candidate@example.com', password: 'pass123', role: 'candidate', name: 'John Candidate', lastLogin: Date.now(), lastAction: Date.now(), totalSessions: 5 },
  { id: 2, email: 'hr@example.com', password: 'pass123', role: 'hr', name: 'Jane HR', lastLogin: Date.now() - 3600000, lastAction: Date.now() - 600000, totalSessions: 12 },
  { id: 3, email: 'admin@example.com', password: 'pass123', role: 'admin', name: 'Admin User', lastLogin: Date.now() - 86400000, lastAction: Date.now() - 86400000, totalSessions: 23 }
];

const initialActivityLog: ActivityLogEntry[] = [
  { id: 1, user: 'John Candidate', action: 'uploaded resume.pdf', timestamp: Date.now() - 600000 },
  { id: 2, user: 'Jane HR', action: 'shortlisted John for Full Stack Developer', timestamp: Date.now() - 1200000 }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(initialActivityLog);

  const logActivity = (action: string, userName?: string) => {
    setActivityLog(prev => [
      { id: Date.now(), user: userName || user?.name || 'System', action, timestamp: Date.now() },
      ...prev
    ].slice(0, 50));
  };

  const login = (email: string, password: string): User | null => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData: User = { 
        ...foundUser, 
        lastLogin: Date.now(), 
        lastAction: Date.now(),
        totalSessions: (foundUser.totalSessions || 0) + 1
      };
      setUser(userData);
      setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
      logActivity(`${userData.name} logged in`, userData.name);
      return userData;
    }
    return null;
  };

  const logout = () => {
    if (user) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, lastAction: Date.now() } : u));
      logActivity(`${user.name} logged out`);
    }
    setUser(null);
  };

  const addHistoryEntry = (entry: Omit<HistoryEntry, 'id'>): number => {
    const id = Date.now();
    setHistory(prev => [{ ...entry, id }, ...prev]);
    logActivity(`${user?.name || 'Candidate'} uploaded ${entry.filename}`);
    return id;
  };

  const updateHistoryStatus = (id: number, newStatus: HistoryEntry['status'], data: Partial<HistoryEntry> = {}) => {
    setHistory(prev => prev.map(h => h.id === id ? { ...h, status: newStatus, ...data } : h));
    const entry = history.find(h => h.id === id);
    if (entry) {
      logActivity(`${user?.name || 'User'} ${newStatus} ${entry.filename}`);
      setUsers(prev => prev.map(u => u.id === user?.id ? { ...u, lastAction: Date.now() } : u));
    }
  };

  const getUserHistory = (userId: number): HistoryEntry[] => {
    return history.filter(h => h.userId === userId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, users, history, activityLog,
      login, logout, addHistoryEntry, updateHistoryStatus, getUserHistory 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
