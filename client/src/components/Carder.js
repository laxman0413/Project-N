import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import card1 from '../assets/card1.jpg';
import './Carder.css';

function Carder() {
  // State to manage dialog (overlay) visibility
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Function to handle card click and open dialog
  const handleCardClick = () => {
    setDialogOpen(true);
  };

  // Function to handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      {/* Card with clickable area */}
      <Card sx={{ maxWidth: 345 }} className='card'>
        <CardActionArea onClick={handleCardClick}>
          <img src={card1} alt="Avatar" className='image' />
          <CardContent>
            {/* Title */}
            <Typography gutterBottom variant="h5" component="div">
              Title
            </Typography>

            {/* Date and Time */}
            <p className='card_header_comp'>Date:</p>
            <p className='card_header_comp'>Time:</p>

            {/* Description */}
            <Typography variant="body2" color="text.secondary">
              Lorem1 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>

            {/* Payment, Location, Worker Capacity */}
            <h4 className='card_header_comp'>Payment:</h4>
            <h4 className='card_header_comp'>Location:</h4>
            <h4 className='card_header_comp'>Worker Capacity:</h4>
          </CardContent>
        </CardActionArea>

        {/* Card Actions (Share Button) */}
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
        </CardActions>
      </Card>

      {/* Dialog (Modal) */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Additional Details</DialogTitle>
        <DialogContent>
          <h2>Description</h2>
          <p>Lorem 10</p>
          <Typography variant="body2" color="text.secondary">
            {/* Additional details content */}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Carder;
