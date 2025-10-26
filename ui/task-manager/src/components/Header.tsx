import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { RocketLaunch } from '@mui/icons-material';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        background: darkMode
          ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
          : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        border: 'none',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <RocketLaunch sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Task
          </Typography>
        </Box>
        <Box>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};