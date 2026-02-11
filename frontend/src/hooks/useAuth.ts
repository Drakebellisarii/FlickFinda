import { useState, useEffect } from 'react';
import { apiService } from '../api';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiService.checkAuth();
      setAuthenticated(response.authenticated);
      setUser(response.user || null);
    } catch (error) {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setAuthenticated(false);
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, authenticated, loading, checkAuth, logout };
};
