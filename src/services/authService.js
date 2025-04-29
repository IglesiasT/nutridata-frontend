import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080/auth', // Keycloak base url
  realm: 'nutridata-realm',
  clientId: 'my-cliente-id'
};

const keycloak = new Keycloak(keycloakConfig);

const authService = {
  init: () => {
    return new Promise((resolve, reject) => {
      keycloak.init({
        onLoad: 'check-sso',         // Check if user is already logged in
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      }).then(authenticated => {
        resolve(authenticated);
      }).catch(error => {
        reject(error);
      });
    });
  },

  login: () => {
    return keycloak.login();
  },

  logout: () => {
    return keycloak.logout();
  },

  register: () => {
    return keycloak.register();
  },

  getCurrentUser: () => {
    if (keycloak.authenticated) {
      // Decode token to get user information
      return {
        username: keycloak.tokenParsed.preferred_username,
        name: keycloak.tokenParsed.name,
        email: keycloak.tokenParsed.email,
        roles: keycloak.tokenParsed.realm_access?.roles || []
      };
    }
    return null;
  },

  hasRole: (role) => {
    return keycloak.hasRealmRole(role);
  },

  getToken: () => {
    return keycloak.token;
  },

  // Update token if it's about to expire
  updateToken: (minValidity = 5) => {
    return new Promise((resolve, reject) => {
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

  // Generate header for API requests
  authHeader: () => {
    if (keycloak.token) {
      return { 'Authorization': 'Bearer ' + keycloak.token };
    }
    return {};
  },

  isAuthenticated: () => {
    return !!keycloak.authenticated;
  }
};

export default authService;
