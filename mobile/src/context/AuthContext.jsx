import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import api, { API_BASE_URL } from '../api/axios';

const AuthContext = createContext(null);

const getErrorMessage = (error, fallback) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ECONNABORTED') return `Request timed out. API: ${API_BASE_URL}`;
  if (!error?.response) return `Cannot reach API (${API_BASE_URL}). If using a real phone, use your PC LAN IP instead of localhost.`;
  return fallback;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const saved = await SecureStore.getItemAsync('fintrack_token');
      if (!saved) {
        setLoading(false);
        return;
      }

      setToken(saved);
      api.defaults.headers.common.Authorization = `Bearer ${saved}`;

      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch {
        await SecureStore.deleteItemAsync('fintrack_token');
        delete api.defaults.headers.common.Authorization;
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await SecureStore.setItemAsync('fintrack_token', data.token);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      setToken(data.token);
      setUser(data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed'));
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      await SecureStore.setItemAsync('fintrack_token', data.token);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      setToken(data.token);
      setUser(data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed'));
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('fintrack_token');
    delete api.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
