import React, { useState,useContext,useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Box,
  Badge,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logoImage from '../logo.png';
import { Logincontex } from './JobseekerloginContext/Logincontext';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

function Menu() {
  const [currentuser, error, userloginStatus, LoginUser, LogoutUser] = useContext(Logincontex);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
useEffect(() => {
    // Fetch unread notification count
    const fetchUnreadCount = async () => {
      try {
        // Get token from local storage or context
        const token = localStorage.getItem('token'); // Adjust if you store it elsewhere
        if (!token) {
          console.error('Token is missing');
          return;
        }
  
        // Make the request with the token
        const response = await fetch('https://nagaconnect-iitbilai.onrender.com/notifications/getUnreadCount', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send token in Authorization header
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        } else {
          console.error('Failed to fetch unread notification count');
        }
      } catch (error) {
        console.error('Error fetching unread notification count:', error);
      }
    };
  
    fetchUnreadCount();
  }, []);
  


  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    LogoutUser();
    navigate('/job-provider/login');
    setDrawerOpen(false);
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#ffffff', color: '#000000' }}>
        <Toolbar>
          {/* Hamburger Menu Icon */}
          <IconButton edge="start" onClick={handleDrawerOpen} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <h1 style={{ height: '20px' }}><b>NagaConnect</b> </h1>
          </Typography>

          {/* Action Icons */}
          <Box>
            <IconButton>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon onClick={()=> handleNavigation('/job-seeker/notifications')} />
              </Badge>
            </IconButton>
            <IconButton onClick={()=>handleNavigation('/job-seeker/profile')}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (Sidebar Menu) */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 300 }}>
          {/* Sidebar List */}
          <List>
            {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ListItem>
              <ListItemText primary={<Typography variant="h6">Menu</Typography>} />
            </ListItem>
            
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>
            <Divider />
            {/* Links */}
            <ListItem button onClick={()=>navigate('/job-seeker/DashBoard')}>
              <ListItemText primary="Home" />
            </ListItem>
            <Divider />
            <ListItem button onClick={()=>handleNavigation('/job-seeker/profile')} >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={()=>handleNavigation('/job-seeker/applied-jobs')}>
              <ListItemText primary="My Jobs" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="My Reviews" />
            </ListItem>
            <Divider />
            <ListItem button onClick={()=>handleNavigation('/help-and-support/job-seeker')}>
              <ListItemText primary="Help Centre" />
            </ListItem>
            <ListItem button onClick={()=>handleNavigation('/privacy-policy')}>
              <ListItemText primary="Privacy Centre" />
            </ListItem>
            <ListItem button onClick={()=>handleNavigation('/terms-and-conditions')}>
              <ListItemText primary="Terms" />
            </ListItem>
            <Divider />
            <ListItem button onClick={()=>handleLogout()}>
              <ListItemText primary="Sign Out" />
            </ListItem>
            <ListItem>
              <Typography variant="caption" sx={{ color: '#888888' }}>
                © 2024 NagaConnect
              </Typography>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default Menu;
