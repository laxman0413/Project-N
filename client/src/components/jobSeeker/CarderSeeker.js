import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import card1 from './assets/card1.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CarderSeeker.css'; // Import the CSS file for custom styles

function CarderSeeker({ job, fetchJobs }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isApplyDialogOpen, setApplyDialogOpen] = useState(false);
  const [application, setApplication] = useState('');
  const navigate = useNavigate();

  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleApplyClick = () => {
    setApplyDialogOpen(true);
  };

  const handleApplyClose = () => {
    setApplyDialogOpen(false);
  };

  const handleApplicationChange = (e) => {
    setApplication(e.target.value);
  };

  const handleSubmitApplication = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`https://nagaconnect-iitbilai.onrender.com/jobSeeker/apply/${job.id}`, { application }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log(response.data);
          handleApplyClose();
        })
        .catch(error => {
          console.error('Error submitting application:', error);
        });
    } else {
      console.log("Please Login First");
    }
  };

  return (
    <div>
      <Card className='custom-card'>
        <CardActionArea onClick={handleCardClick}>
          <img src={job.images || card1} alt="Job" className='custom-image' />
          <CardContent className='custom-content'>
            <Typography variant="body2" color="text.secondary">
              <strong>Job Title:</strong> {job.jobTitle}
            </Typography>
            <Typography gutterBottom variant="h6" component="div" className='job-title'>
              {job.jobTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Payment:</strong> {job.payment}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className='custom-actions'>
          <button className='ignore-button' onClick={handleCloseDialog}>
            Ignore
          </button>
          <button className='apply-button' onClick={handleApplyClick}>
            Apply
          </button>
        </CardActions>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} className='dialog'>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            <strong>Job Title:</strong> {job.jobTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Type of Job:</strong> {job.jobType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Payment:</strong> {job.payment}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>People Needed:</strong> {job.peopleNeeded}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Location:</strong> {job.location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Date:</strong> {job.date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Time:</strong> {job.time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Negotiability:</strong> {job.negotiability}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Description:</strong> {job.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Additional Details:</strong> {job.additionalDetails}
          </Typography>
        </DialogContent>
        <DialogActions>
          <button onClick={handleCloseDialog} className='dialog-button'>
            Close
          </button>
        </DialogActions>
      </Dialog>

      <Dialog open={isApplyDialogOpen} onClose={handleApplyClose} className='dialog'>
        <DialogTitle>Apply for Job</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Application"
            name="application"
            value={application}
            onChange={handleApplicationChange}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleApplyClose} className='dialog-button'>
            Cancel
          </button>
          <button onClick={handleSubmitApplication} className='dialog-button dialog-button-success'>
            Submit
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CarderSeeker;
