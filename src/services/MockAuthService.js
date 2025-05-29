const mockTokenData = {
  preferred_username: 'usuario_prueba',
  name: 'Usuario de Prueba',
  email: 'usuario@example.com',
  realm_access: {
    roles: ['user', 'admin'] // Add any roles you want to simulate
  },
  exp: Math.floor(Date.now() / 1000) + 3600 // Token valid for 1 hour
};

const generateMockToken = () => {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken' + Math.random().toString(36).substring(2);
};

let mockKeycloak = {
  authenticated: false,
  token: null,
  tokenParsed: null,
  
  init: (options) => Promise.resolve(false),
  
  login: () => {
    mockKeycloak.authenticated = true;
    mockKeycloak.token = generateMockToken();
    mockKeycloak.tokenParsed = { ...mockTokenData };
    console.log('Mock: Usuario autenticado');
    return Promise.resolve();
  },
  
  logout: () => {
    mockKeycloak.authenticated = false;
    mockKeycloak.token = null;
    mockKeycloak.tokenParsed = null;
    console.log('Mock: Usuario desconectado');
    return Promise.resolve();
  },
  
  register: () => {
    console.log('Mock: Registro simulado');
    return mockKeycloak.login();
  },
  
  hasRealmRole: (role) => {
    if (!mockKeycloak.authenticated) return false;
    return mockKeycloak.tokenParsed.realm_access.roles.includes(role);
  },
  
  updateToken: (minValidity) => {
    if (!mockKeycloak.authenticated) return Promise.reject(new Error('No autenticado'));
    console.log('Mock: Token actualizado');
    return Promise.resolve(true);
  }
};

const mockAuthService = {
  init: () => {
    console.log('Mock: Inicializando servicio de autenticación simulado');
    return Promise.resolve(mockKeycloak.authenticated);
  },
  
  login: () => {
    return mockKeycloak.login();
  },
  
  logout: () => {
    return mockKeycloak.logout();
  },
  
  register: () => {
    return mockKeycloak.register();
  },
  
  getCurrentUser: () => {
    if (mockKeycloak.authenticated) {
      return {
        username: mockKeycloak.tokenParsed.preferred_username,
        name: mockKeycloak.tokenParsed.name,
        email: mockKeycloak.tokenParsed.email,
        roles: mockKeycloak.tokenParsed.realm_access?.roles || []
      };
    }
    return null;
  },
  
  hasRole: (role) => {
    return mockKeycloak.hasRealmRole(role);
  },
  
  getToken: () => {
    return mockKeycloak.token;
  },
  
  updateToken: (minValidity = 5) => {
    return mockKeycloak.updateToken(minValidity)
      .then(() => mockKeycloak.token);
  },
  
  authHeader: () => {
    if (mockKeycloak.token) {
      return { 'Authorization': 'Bearer ' + mockKeycloak.token };
    }
    return {};
  },
  
  isAuthenticated: () => {
    return !!mockKeycloak.authenticated;
  },
  
  setMockRoles: (roles) => {
    if (mockKeycloak.tokenParsed) {
      mockKeycloak.tokenParsed.realm_access.roles = roles;
    }
  },

  setAuthenticationError: () => {
    mockKeycloak.login = () => Promise.reject(new Error('Error de autenticación simulado'));
    return mockAuthService;
  },
  
  // Reset to normal behavior
  resetBehavior: () => {
    mockKeycloak = { ...mockKeycloak };
    mockKeycloak.login = () => {
      mockKeycloak.authenticated = true;
      mockKeycloak.token = generateMockToken();
      mockKeycloak.tokenParsed = { ...mockTokenData };
      return Promise.resolve();
    };
    return mockAuthService;
  }
};

export default mockAuthService;