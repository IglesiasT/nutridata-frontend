import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authServiceFactory';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Inicializando autenticación...');
      
      // Inicializar Keycloak
      const isAuthenticated = await authService.init();
      setInitialized(true);
      
      if (isAuthenticated) {
        const currentUser = authService.getCurrentUser();
        console.log('Usuario autenticado:', currentUser);
        setUser(currentUser);
      } else {
        console.log('Usuario no autenticado');
      }
    } catch (err) {
      console.error('Error al inicializar autenticación:', err);
      setError('Error al inicializar el sistema de autenticación');
      setInitialized(true); // Marcamos como inicializado aunque haya error
    } finally {
      setLoading(false);
    }
  };

  // Login con OAuth2 - redirige a Keycloak
  const login = async () => {
    if (!initialized) {
      setError('El sistema de autenticación no está inicializado');
      return;
    }

    try {
      setError(null);
      console.log('Redirigiendo a Keycloak para login...');
      await authService.login();
      
      // Para el mock: verificar si ahora está autenticado
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        console.log('Usuario autenticado:', currentUser);
        setUser(currentUser);
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión');
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    if (!initialized) {
      return;
    }

    try {
      setError(null);
      console.log('Cerrando sesión...');
      await authService.logout();
      setUser(null);
      // Esta línea normalmente no se ejecuta porque hay redirección
    } catch (err) {
      console.error('Error en logout:', err);
      setError('Error al cerrar sesión');
    }
  };

  // Register con OAuth2 - redirige a Keycloak
  const register = async () => {
    if (!initialized) {
      setError('El sistema de autenticación no está inicializado');
      return;
    }

    try {
      setError(null);
      console.log('Redirigiendo a Keycloak para registro...');
      await authService.register();
      // Esta línea normalmente no se ejecuta porque hay redirección
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al registrarse');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    initialized,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    getToken: authService.getToken,
    authHeader: authService.authHeader,
    hasRole: authService.hasRole,
    updateToken: authService.updateToken,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};