import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeContextProvider } from './theme/ThemeContextProvider';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

function AppContent() {
  return <Layout />;
}

export default App;