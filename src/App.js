import './App.css';
import Layout from './components/Layout';
import { ThemeContextProvider } from './theme/ThemeContextProvider';

function App() {
  return (
    <ThemeContextProvider>
      <Layout />
    </ThemeContextProvider>
  );
}

export default App;