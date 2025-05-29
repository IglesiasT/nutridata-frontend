import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8181',
  realm: 'nutridata-realm',
  clientId: 'nutridata_client'
};

let keycloak;
let initPromise;

const authService = {
  // Inicializar Keycloak una sola vez
  init: () => {
    if (initPromise) {
      return initPromise;
    }

    initPromise = new Promise((resolve, reject) => {
      try {
        keycloak = new Keycloak(keycloakConfig);
        
        keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          checkLoginIframe: false,
          flow: 'standard'
        }).then(authenticated => {
          console.log('Keycloak inicializado. Autenticado:', authenticated);
          resolve(authenticated);
        }).catch(error => {
          console.error('Error al inicializar Keycloak:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Error creando instancia de Keycloak:', error);
        reject(error);
      }
    });

    return initPromise;
  },

  // Login redirige a Keycloak
  login: () => {
    if (!keycloak) {
      throw new Error('Keycloak no está inicializado');
    }
    return keycloak.login();
  },

  logout: () => {
    if (!keycloak) {
      throw new Error('Keycloak no está inicializado');
    }
    return keycloak.logout();
  },

  register: () => {
    if (!keycloak) {
      throw new Error('Keycloak no está inicializado');
    }
    return keycloak.register();
  },

  getCurrentUser: () => {
    if (!keycloak || !keycloak.authenticated) {
      return null;
    }
    
    try {
      return {
        username: keycloak.tokenParsed?.preferred_username,
        name: keycloak.tokenParsed?.name,
        email: keycloak.tokenParsed?.email,
        roles: keycloak.tokenParsed?.realm_access?.roles || [],
        token: keycloak.token
      };
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },

  hasRole: (role) => {
    if (!keycloak) return false;
    return keycloak.hasRealmRole(role);
  },

  getToken: () => {
    return keycloak?.token;
  },

  updateToken: (minValidity = 5) => {
    return new Promise((resolve, reject) => {
      if (!keycloak) {
        reject(new Error('Keycloak no está inicializado'));
        return;
      }

      keycloak.updateToken(minValidity)
        .then(refreshed => {
          if (refreshed) {
            console.log('Token actualizado');
          }
          resolve(keycloak.token);
        })
        .catch(error => {
          console.error('Error al actualizar el token', error);
          reject(error);
        });
    });
  },

  authHeader: () => {
    if (keycloak?.token) {
      return { 'Authorization': 'Bearer ' + keycloak.token };
    }
    return {};
  },

  isAuthenticated: () => {
    return !!(keycloak?.authenticated);
  },

  // Método para verificar si Keycloak está inicializado
  isInitialized: () => {
    return !!keycloak;
  }
};

export default authService;