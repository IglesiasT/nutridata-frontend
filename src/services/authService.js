const API_URL = 'http://localhost:8080/auth/';

const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Error en login');
    }
    
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('user', JSON.stringify({ username, token: data.token }));
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
  
  register: async (username, password) => {
    const response = await fetch(`${API_URL}signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Error en registro');
    }
    
    try {
      return await response.json();
    } catch (error) {
      return await response.text();
    }
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  authHeader: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.token) {
      return { 'Authorization': 'Bearer ' + user.token };
    } else {
      return {};
    }
  }
};

export default authService;