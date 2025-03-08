import { green, lightGreen, grey, teal } from "@mui/material/colors";

// Base theme
const theme = {
  palette: {
    primary: green,
  },
};

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode palette
          primary: {
            main: green[600], // Verde manzana vibrante pero no demasiado brillante
            light: green[400],
            dark: green[800],
          },
          secondary: {
            main: teal[500], // Color complementario
            light: teal[300],
            dark: teal[700],
          },
          background: {
            default: "#f5f8f5", // Fondo ligeramente verdoso pero muy sutil
            paper: "#ffffff",
          },
          divider: green[200],
          text: {
            primary: grey[900],
            secondary: grey[700],
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: lightGreen[500], // Verde manzana más claro para destacar en modo oscuro
            light: lightGreen[300],
            dark: lightGreen[700],
          },
          secondary: {
            main: teal[400], // Color complementario ajustado para modo oscuro
            light: teal[300],
            dark: teal[600],
          },
          background: {
            default: "#0c1e14", // Verde muy oscuro casi negro
            paper: "#132a1c", // Verde oscuro para las tarjetas y superficies
          },
          divider: green[800],
          text: {
            primary: "#ffffff",
            secondary: grey[400],
          },
        }),
  },
  // Personalización adicional de componentes para una experiencia más coherente
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === "light" 
            ? '0 2px 8px rgba(0, 0, 0, 0.05)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
  typography: {
    fontFamily: "'Nunito', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

export default theme;