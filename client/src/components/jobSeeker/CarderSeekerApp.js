import React, { useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import card1 from '../assets/card1.jpg'; // Assuming default image is in assets folder

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
    if (!token) return;

    try {
      console.log('Withdrawing job application:', job.application_id);
      await axios.delete(`https://nagaconnect-iitbilai.onrender.com/jobseeker/withdrawJob/${job.application_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("job withdrawn Successfully");
      onWithdraw(job.application_id);
      handleCloseDialog();
    } catch (error) {
      console.error('Error withdrawing job application:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <Card sx={{ maxWidth: 345, backgroundColor: '#f5f5f5', color: '#000' }} className='card'>
        <CardActionArea onClick={handleCardClick}>
          <img src={job.images || card1} alt="Job" className='image' style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <CardContent>
            <Typography variant="body2" component="div" style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Location: {job.location || 'N/A'}
            </Typography>
            <Typography variant="h6" component="div" style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>
              Job Title: {job.jobTitle}
            </Typography>
            <Typography variant="body2" component="div" style={{ textAlign: 'center' }}>
              Payment: {job.payment.join(', ')}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions style={{ justifyContent: 'center' }}>
          <Button size="small" color="primary" onClick={handleCardClick}>
            View Details
          </Button>
        </CardActions>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle style={{ fontWeight: 'bold', textAlign: 'center' }}>Job Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            <strong>Job Title:</strong> {job.jobTitle}<br />
            <strong>Type of Job:</strong> {job.jobType}<br />
            <strong>Payment:</strong> {job.payment.join(', ')}<br />
            <strong>People Needed:</strong> {job.peopleNeeded}<br />
            <strong>Location:</strong> {job.location}<br />
            <strong>Date:</strong> {new Date(job.date).toLocaleDateString()}<br />
            <strong>Time:</strong> {new Date(job.time).toLocaleTimeString()}<br />
            <strong>Negotiability:</strong> {job.negotiability ? job.negotiability : 'Non-Negotiable'}<br />
            <strong>Description:</strong> {job.description || 'No additional description available.'}<br />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
          <Button onClick={handleWithdraw} color="secondary">Withdraw</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CarderSeekerApp;
