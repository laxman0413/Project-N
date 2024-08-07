import React, { useState ,useContext} from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { Logincontex } from './JobProviderloginContext/Logincontext';
import Link from '@mui/material';
//uses mui styles
function Menu() {
  // State to manage drawer (sliding menu) visibility
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate=useNavigate();
  let [currentuser,error,userloginStatus,LoginUser,LogoutUser]=useContext(Logincontex)
  // Function to handle menu icon click and open drawer
  const handleMenuIconClick = () => {
    setDrawerOpen(true);
  };

  // Function to handle drawer close
  const handleProfileDrawerClose = () => {
    navigate('/job-provider/profile')
    setDrawerOpen(false);
  };

  // Function to handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const handleLogoutDrawerClose = () => {
    LogoutUser();
    navigate('/job-provider/login')
    setDrawerOpen(false);
  };
  const handleAdvertise=()=>{
    navigate('/advertise')
  }

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
            <h2>Your Title</h2>
          </div>
          
          {/* Your three-bar logo can be added here */}
          {/* Add your logo component */}
        </Toolbar>
      </AppBar>

      {/* Drawer (Sliding Menu) */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        {/* List of menu items */}
        <List>
          <ListItem  onClick={handleProfileDrawerClose} >
              <link to="/job-provider/profile" />
            <ListItemText  primary="Profile" />
          </ListItem>
          <ListItem  onClick={handleDrawerClose}>
            <ListItemText primary="Change Password" />
          </ListItem>
          <ListItem  onClick={handleLogoutDrawerClose}>
            <ListItemText primary="Log Out" />
          </ListItem>
          <ListItem  onClick={handleAdvertise}>
            <ListItemText primary="Advertise" />
          </ListItem>
        </List>
      </Drawer>

    </div>
  );
}

export default Menu;
