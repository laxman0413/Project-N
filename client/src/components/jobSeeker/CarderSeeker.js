// frontend/src/CarderSeeker.js
import React, { useState, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import card1 from '../jobSeeker/assets/card1.jpg';
import './CarderSeeker.css';
import axios from 'axios';
import { Logincontex } from './JobseekerloginContext/Logincontext';

function CarderSeeker({ job }) {
  // State to manage dialog (overlay) visibility
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentuser, , userloginStatus] = useContext(Logincontex);

  // Function to handle card click and open dialog
  const handleCardClick = () => {
    setDialogOpen(true);
  };

  // Function to handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Function to handle job acceptance
// Function to handle job acceptance
const handleAcceptJob = () => {
  const token = localStorage.getItem('token');
  axios.post('http://localhost:3001/jobseeker/accept-job', { id: job.id }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log(response.data.message);
    // Optionally, close the dialog and/or show a success message
    handleCloseDialog();
  })
  .catch(error => {
    console.error('Error accepting job:', error);
  });
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
          <Button onClick={handleAcceptJob} color="primary">Accept Job</Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CarderSeeker;
