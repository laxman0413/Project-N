// frontend/src/Carder.js
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import card1 from '../assets/card1.jpg';
import './Carder.css';

function Carder({ job }) {
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
              {job.jobTitle}
            </Typography>
            <p className='card_header_comp'>Job Type: {job.jobType}</p>
            {/* Date and Time */}
            <p className='card_header_comp'>Date: {job.date}</p>
            <p className='card_header_comp'>Time: {job.time}</p>

            {/* Description */}
            <Typography variant="body2" color="text.secondary">
              {job.description}
            </Typography>

            {/* Payment, Location, Worker Capacity */}
            <h4 className='card_header_comp'>Payment: {job.payment}</h4>
            <h4 className='card_header_comp'>Location: {job.location}</h4>
            <h4 className='card_header_comp'>Worker Capacity: {job.peopleNeeded}</h4>
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
          <p>{job.additionalDetails}</p>
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