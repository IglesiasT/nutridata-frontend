import { useState, useMemo } from 'react';
import { createTheme } from '@mui/material';
import { getDesignTokens } from './theme';

export const useColorTheme = () => {
  const [mode, setMode] = useState('light');
  
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Update the theme based on the mode
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return {
    mode,
    toggleColorMode,
    theme
  };
};