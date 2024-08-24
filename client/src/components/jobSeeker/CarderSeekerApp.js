import React, { useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import card1 from '../assets/card1.jpg';

function CarderSeekerApp({ job, onWithdraw }) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleWithdraw = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log('Withdrawing job application:', job.application_id);
        await axios.delete(`https://nagaconnect-iitbilai.onrender.com/jobseeker/withdrawJob/${job.application_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onWithdraw(job.application_id);
        handleCloseDialog(); // Close dialog after successful withdrawal
      } catch (error) {
        console.error('Error withdrawing job application:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div>
      <Card sx={{ maxWidth: 345 }} className='card'>
        <CardActionArea onClick={handleCardClick}>
          <img src={card1} alt="Avatar" className='image' />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {job.jobTitle}
            </Typography>
            <p className='card_header_comp'>Job Type: {job.jobType}</p>
            <p className='card_header_comp'>Date: {new Date(job.date).toLocaleDateString()}</p>
            <p className='card_header_comp'>Time: {new Date(job.time).toLocaleTimeString()}</p>
            <p className='card_header_comp'>Number of people: {job.peopleNeeded}</p>
            <h4 className='card_header_comp'>Payment(per person): {job.payment.join(', ')}</h4>
            <h4 className='card_header_comp'>Location: {job.location}</h4>
            <h4 className='card_header_comp'>Negotiability: {job.negotiability ? job.negotiability : 'Not negotiable'}</h4>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
        </CardActions>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Additional Details</DialogTitle>
        <DialogContent>
          <h2>Description</h2>
          <p>{job.description ? job.description : 'No description available'}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handleWithdraw} color="secondary">Withdraw</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CarderSeekerApp;
