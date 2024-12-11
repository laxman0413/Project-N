import React, { useState,useContext } from 'react';
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
  const navigate = useNavigate();

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
              <ChatIcon />
            </IconButton>
            <IconButton>
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
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
            <ListItem button>
              <ListItemText primary="Privacy Centre" />
            </ListItem>
            <ListItem button>
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
