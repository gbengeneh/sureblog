import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    console.log('AuthContext: Initial token from localStorage:', token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.log('AuthContext: Token expired, logging out');
          // Token is expired, logout
          logout();
        } else {
          console.log('AuthContext: Token valid, setting user:', decoded);
          setUser(decoded);
        }
      } catch (error) {
        console.error('AuthContext: Error decoding token:', error);
        setUser(null);
      }
    } else {
      console.log('AuthContext: No token, setting user to null');
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    console.log('AuthContext: Logging in with token:', newToken);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      console.log('AuthContext: Decoded user on login:', decoded);
      setUser(decoded);
    } catch (error) {
      console.error('AuthContext: Error decoding token on login:', error);
      setUser(null);
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user || !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
