import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Container
} from '@mui/material';
import logo from '../assets/images/nutridata-logo.webp';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(username, password);
        navigate('/dashboard'); 
      } else {
        await register(username, password);
        setIsLogin(true); // Cambiar a login después de registro exitoso
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Box 
          sx={{ 
            mb: 4,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}
        >
          <img src={logo} alt="NutriData Logo" style={{ height: 60, marginBottom: 16 }} />
          <Typography component="h1" variant="h5">
            NutriData
          </Typography>
        </Box>
        
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography component="h2" variant="h6" align="center" gutterBottom>
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Usuario"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={!isLogin} 
                      onChange={() => setIsLogin(!isLogin)} 
                    />
                  }
                  label={isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;