import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Logincontex } from './JobseekerloginContext/Logincontext';

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
  const handleDashDrawerClose = () => {
    navigate('/job-seeker/dashboard');
    setDrawerOpen(false);
  };

  // Function to handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogoutDrawerClose = () => {
    LogoutUser();
    navigate('/job-seeker/login');
    setDrawerOpen(false);
  };

  const handleAdvertise = () => {
    navigate('/advertise');
  };

  const handleProfileClick = () => {
    navigate('/job-seeker/profile');
  };

  return (
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
            <h2>Job Seeker</h2>
          </div>
          
          {/* Profile Icon */}
          <IconButton edge="end" color="inherit" onClick={handleProfileClick}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer (Sliding Menu) */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        {/* List of menu items */}
        <List>
          <ListItem onClick={handleDashDrawerClose}>
            <ListItemText primary="DashBoard" />
          </ListItem>
          <ListItem onClick={handleDrawerClose}>
            <ListItemText primary="Change Password" />
          </ListItem>
          <ListItem onClick={handleLogoutDrawerClose}>
            <ListItemText primary="Log Out" />
          </ListItem>
          <ListItem onClick={handleAdvertise}>
            <ListItemText primary="Advertise" />
          </ListItem>
          {/* Add more menu items as needed */}
        </List>
      </Drawer>

      {/* The rest of your application content goes here */}
      {/* Add your components and content */}
    </div>
  );
}

export default Menu;
