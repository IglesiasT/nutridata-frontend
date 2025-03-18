import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Link,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock
} from '@mui/icons-material';
import logo from '../assets/images/nutridata-logo.webp';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, error, loading } = useAuth();
  const navigate = useNavigate();
  
  const isLogin = tabValue === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(username, password);
        navigate('/dashboard'); 
      } else {
        await register(username, password);
        setTabValue(0); // Change to login tab after registration
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Logo and header */}
          <Box 
            sx={{ 
              pt: 4,
              pb: 2,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <img 
              src={logo} 
              alt="NutriData Logo" 
              style={{ 
                height: 70, 
                marginBottom: 16,
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
              }} 
            />
            <Typography 
              component="h1" 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              NutriData
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 1 }}
            >
              Gestión nutricional inteligente
            </Typography>
          </Box>
          
          {/* Login and sign up tabs */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            indicatorColor="primary"
            textColor="primary"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
            }}
          >
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>
          
          <CardContent sx={{ px: 3, pt: 3, pb: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: 1
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ mt: 1 }}
            >
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {isLogin && (
                <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
                  <Link href="#" variant="body2" underline="hover">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  py: 1.5,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
                disableElevation
                disabled={loading}
              >
                {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
              
              {!isLogin && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Al registrarte, aceptas nuestros{' '}
                  <Link href="#" underline="hover">Términos de servicio</Link> y{' '}
                  <Link href="#" underline="hover">Política de privacidad</Link>
                </Typography>
              )}
            </Box>
          </CardContent>
        </Paper>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} NutriData. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;