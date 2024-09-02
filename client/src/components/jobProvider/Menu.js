import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, createTheme, ThemeProvider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Logincontex } from './JobProviderloginContext/Logincontext';

// Create a black theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000',
      paper: '#333',
    },
    text: {
      primary: '#fff',
      secondary: '#aaa',
    },
    primary: {
      main: '#1976d2', // Adjust if needed
    },
  },
});

function Menu() {
  // State to manage drawer visibility
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [currentuser, error, userloginStatus, LoginUser, LogoutUser] = useContext(Logincontex);

  // Toggles the drawer open/close state
  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  // Handles navigation and drawer close
  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  // Handles logout
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
        {/* App Bar with Menu Icon and Title */}
        <AppBar position="static">
          <Toolbar>
            {/* Menu Icon */}
            <IconButton edge="start" color="inherit" onClick={() => toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>

            {/* Title */}
            <div style={{ flexGrow: 1 }}>
              <h2 style={{ color: theme.palette.text.primary }}>Job</h2>
            </div>

            <IconButton edge="end" color="inherit" onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer (Sliding Menu) */}
        <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
          <List>
            <ListItem button onClick={() => handleNavigation('/job-provider/DashBoard')}>
              <ListItemText primary="DashBoard" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/change-password')}>
              <ListItemText primary="Change Password" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Log Out" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/advertise')}>
              <ListItemText primary="Advertise" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
          </List>
        </Drawer>
      </div>
    </ThemeProvider>
  );
}

export default Menu;
