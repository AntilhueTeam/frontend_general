"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto con un valor predeterminado
const AuthContext = createContext({
  isAuthenticated: false,
  loading: true,
  checkAuth: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const AUTH_URL = process.env.NEXT_PUBLIC_API_AUTH_URL
  const checkAuth = async () => {
    try {
      const response = await axios.get(AUTH_URL+'/validate', {
        withCredentials: true, // Enviar cookies al backend
      });

      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      checkAuth();
    }
  }, [loading]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
