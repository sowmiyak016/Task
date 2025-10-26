import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface ThemeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleDarkMode} color="inherit">
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};