import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Logincontex } from './JobProviderloginContext/Logincontext';

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
            <h2>Job </h2>
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
            <ListItemText primary="DashBoard" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/change-password')}>
            <ListItemText primary="Change Password" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Log Out" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/advertise')}>
            <ListItemText primary="Advertise" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default Menu;
