import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    // For development: Always clear authentication on page load
    if (process.env.NODE_ENV === 'development') {
      // Clear any existing tokens
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api;';
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;';
      setUser(null);
      setLoading(false);
      return;
    }

    // For production: Check authentication normally
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const res = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      
      console.log('Auth check response status:', res.status);
      
      if (res.ok) {
        const userData = await res.json();
        console.log('Auth check successful, userData:', userData);
        setUser(userData);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.log('Auth check failed:', errorData);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const userData = await res.json();
        console.log('Login userData:', userData);
        setUser(userData.user);
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 