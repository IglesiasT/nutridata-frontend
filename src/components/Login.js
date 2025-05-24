import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  CardContent,
  Button,
  Typography,
  Alert,
  Container,
  Tabs,
  Tab,
  Link,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon
} from '@mui/icons-material';
import logo from '../assets/images/nutridata-logo.webp';

const Login = () => {
  const [tabValue, setTabValue] = useState(0);
  const { login, register, error, loading, initialized, clearError } = useAuth();
  
  const isLogin = tabValue === 0;

  const handleLogin = async () => {
    if (!initialized) {
      return;
    }
    
    try {
      clearError();
      await login();
      // Si llegamos aquí, algo salió mal porque debería haber redirección
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  const handleRegister = async () => {
    if (!initialized) {
      return;
    }
    
    try {
      clearError();
      await register();
      // Si llegamos aquí, algo salió mal porque debería haber redirección
    } catch (err) {
      console.error('Error en registro:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    clearError();
  };

  // Mostrar loading mientras se inicializa
  if (loading) {
    return (
      <Container maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Inicializando sistema de autenticación...
          </Typography>
        </Box>
      </Container>
    );
  }

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
                onClose={clearError}
              >
                {error}
              </Alert>
            )}

            {!initialized && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 2,
                  borderRadius: 1
                }}
              >
                Sistema de autenticación no disponible
              </Alert>
            )}
            
            <Box sx={{ mt: 2 }}>
              {isLogin ? (
                <>
                  <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                    Haz clic en el botón para iniciar sesión de forma segura con Keycloak
                  </Typography>
                  
                  <Button
                    onClick={handleLogin}
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<LoginIcon />}
                    sx={{ 
                      mt: 2, 
                      mb: 2,
                      py: 1.5,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                    disableElevation
                    disabled={!initialized}
                  >
                    Iniciar Sesión con Keycloak
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Link href="#" variant="body2" underline="hover">
                      ¿Problemas para acceder?
                    </Link>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                    Crea tu cuenta de forma segura con Keycloak
                  </Typography>
                  
                  <Button
                    onClick={handleRegister}
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<RegisterIcon />}
                    sx={{ 
                      mt: 2, 
                      mb: 2,
                      py: 1.5,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                    disableElevation
                    disabled={!initialized}
                  >
                    Crear Cuenta con Keycloak
                  </Button>
                  
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    Al registrarte, aceptas nuestros{' '}
                    <Link href="#" underline="hover">Términos de servicio</Link> y{' '}
                    <Link href="#" underline="hover">Política de privacidad</Link>
                  </Typography>
                </>
              )}
            </Box>
          </CardContent>
        </Paper>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          © 2024 NutriData. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;