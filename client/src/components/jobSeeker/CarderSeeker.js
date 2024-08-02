/* CarderSeeker.js */
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
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
          fetchJobs();
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
          <img src={job.images || card1} alt="Avatar" className='custom-image' />
          <CardContent className='custom-content'>
            <Typography variant="body2" color="text.secondary">
              Title
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              {job.jobTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Subtitle
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cost: {job.payment}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className='custom-actions'>
          <Button size="small" className='ignore-button' onClick={handleCloseDialog}>
            Ignore
          </Button>
          <Button size="small" className='apply-button' onClick={handleApplyClick}>
            Apply
          </Button>
        </CardActions>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
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
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isApplyDialogOpen} onClose={handleApplyClose}>
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
          <Button onClick={handleApplyClose}>Cancel</Button>
          <Button onClick={handleSubmitApplication}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CarderSeeker;