import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, createTheme, ThemeProvider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Logincontex } from './JobseekerloginContext/Logincontext';

// Create a black theme
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
  // State to manage drawer (sliding menu) visibility
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  let [currentuser, error, userloginStatus, LoginUser, LogoutUser] = useContext(Logincontex);

  // Function to handle menu icon click and open drawer
  const handleMenuIconClick = () => {
    setDrawerOpen(true);
  };

  // Function to handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const handlePassDrawerClose = () => {
    navigate('/job-seeker/reset-password')
    setDrawerOpen(false);
  };
  const handleDashDrawerClose = () => {
    navigate('/job-seeker/dashboard');
    setDrawerOpen(false);
  };

  const handleLogoutDrawerClose = () => {
    LogoutUser();
    navigate('/job-seeker/login');
    setDrawerOpen(false);
  };

  const handleAdvertise = () => {
    navigate('/advertisehome');
  };

  const handleProfileClick = () => {
    navigate('/job-seeker/profile');
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* App Bar with Menu Icon and Title */}
        <AppBar position="static">
          <Toolbar>
            {/* Menu Icon */}
            <IconButton edge="start" color="inherit" onClick={handleMenuIconClick} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            
            {/* Title */}
            <div style={{ flexGrow: 1 }}>
              <h2 style={{ color: theme.palette.text.primary }}>Job Seeker</h2>
            </div>
            
            {/* Profile Icon */}
            <IconButton edge="end" color="inherit" onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer (Sliding Menu) */}
        <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
          <List>
            <ListItem button onClick={handleDashDrawerClose}>
              <ListItemText primary="DashBoard" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={handlePassDrawerClose}>
              <ListItemText primary="Change Password" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={handleLogoutDrawerClose}>
              <ListItemText primary="Log Out" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            <ListItem button onClick={handleAdvertise}>
              <ListItemText primary="Advertise" primaryTypographyProps={{ style: { color: theme.palette.text.primary } }} />
            </ListItem>
            {/* Add more menu items as needed */}
          </List>
        </Drawer>

        {/* The rest of your application content goes here */}
        {/* Add your components and content */}
      </div>
    </ThemeProvider>
  );
}

export default Menu;
