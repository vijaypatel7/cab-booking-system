import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

/**
 * Flatten the API response so user state is always:
 * { id, name, email, phone, role, avatar, token, ... }
 *
 * The backend returns: { user: { id, name, ... }, token }
 * We flatten it so components can simply use `user.name`, `user.email`, etc.
 */
const flattenUserResponse = (data) => {
  const { user: userData, token } = data;
  return { ...userData, token };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        // Verify token is still valid and fetch latest user data
        authApi
          .getMe()
          .then((res) => {
            const freshData = res.data.data;
            setUser((prev) => {
              // Merge: keep token from prev, overlay fresh fields from server
              const merged = { ...prev, ...freshData };
              localStorage.setItem('user', JSON.stringify(merged));
              return merged;
            });
          })
          .catch(() => {
            setUser(null);
            localStorage.removeItem('user');
          })
          .finally(() => setLoading(false));
      } catch {
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const flatUser = flattenUserResponse(res.data.data);
    setUser(flatUser);
    localStorage.setItem('user', JSON.stringify(flatUser));

    // Immediately fetch fresh user data from /auth/me
    try {
      const meRes = await authApi.getMe();
      const freshData = meRes.data.data;
      setUser((prev) => {
        const merged = { ...prev, ...freshData };
        localStorage.setItem('user', JSON.stringify(merged));
        return merged;
      });
    } catch {
      // getMe failed — still keep the login data
    }

    return flatUser;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const res = await authApi.register({ name, email, password, phone });
    const flatUser = flattenUserResponse(res.data.data);
    setUser(flatUser);
    localStorage.setItem('user', JSON.stringify(flatUser));

    // Immediately fetch fresh user data from /auth/me
    try {
      const meRes = await authApi.getMe();
      const freshData = meRes.data.data;
      setUser((prev) => {
        const merged = { ...prev, ...freshData };
        localStorage.setItem('user', JSON.stringify(merged));
        return merged;
      });
    } catch {
      // getMe failed — still keep the register data
    }

    return flatUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prev) => {
      const updated = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
