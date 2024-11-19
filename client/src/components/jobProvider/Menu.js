import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, createTheme, ThemeProvider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Logincontex } from './JobProviderloginContext/Logincontext';

// Create a pure black theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000', // Background for the entire app
      paper: '#000', // Background for drawers and paper components
    },
    text: {
      primary: '#fff', // Text color
      secondary: '#aaa', // Secondary text color
    },
    primary: {
      main: '#1976d2', // Primary color for buttons and icons
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000', // Drawer background
        },
      },
    },
  },
});

function Menu() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [currentuser, error, userloginStatus, LoginUser, LogoutUser] = useContext(Logincontex);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    LogoutUser();
    navigate('/job-provider/login');
    setDrawerOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/job-provider/profile');
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* App Bar */}
        <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <div style={{ flexGrow: 1 }}>
              <h2 style={{ color: theme.palette.text.primary }}>Job Provider</h2>
            </div>
            <IconButton edge="end" color="inherit" onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
          <List>
            <ListItem button onClick={() => handleNavigation('/job-provider/DashBoard')}>
              <ListItemText primary="DashBoard" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/job-provider/reset-password')}>
              <ListItemText primary="Change Password" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Log Out" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/advertisehome')}>
              <ListItemText primary="Advertise" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
          </List>
        </Drawer>
      </div>
    </ThemeProvider>
  );
}

export default Menu;
