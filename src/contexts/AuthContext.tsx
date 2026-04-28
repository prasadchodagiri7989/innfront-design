import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, setTokens, clearTokens, User } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe() as { data: User };
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      refreshUser();
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      setTokens(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(payload) as any;
      setTokens(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
