import realAuthService from './authService';
import mockAuthService from './MockAuthService'

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || false;

// Export the appropriate authentication service based on the environment variable
const authServiceFactory = USE_MOCK ? mockAuthService : realAuthService;
export default authServiceFactory;