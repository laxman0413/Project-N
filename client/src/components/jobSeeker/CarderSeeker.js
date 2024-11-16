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
} from '@mui/material';
import card1 from './assets/card1.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CarderSeeker.css'; // Import the CSS file for custom styles

function CarderSeeker({ job, fetchJobs }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [application, setApplication] = useState('');
  const navigate = useNavigate();
  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
          alert("Job applied successfully");
          fetchJobs();
        })
        .catch(error => {
          console.error('Error submitting application:', error);
        });
    } else {
      console.log("Please Login First");
    }
  };
  return (
    <div style={{ marginBottom: '20px' }} >
      <Card sx={{ maxWidth: 345, backgroundColor: '#333', color: '#399d',border:'solid #333' }} className='custom-card'>
        <CardActionArea onClick={handleCardClick}>
          {/* Display job poster's name at the top */}
          <CardContent className='custom-content'>
            <Typography variant="body2" color="text.secondary" style={{ color: '#fff', fontWeight: 'bold' }}>
            Job Posted by: 
            <Button 
              onClick={() => { 
                if (job.providerId) {
                
                  navigate(`/ppprofile/${job.providerId}`);
                } else {
                  console.error('providerID is undefined!');
                  // Handle the case when providerID is missing
                }
              }}
              style={{ color: '#007bff', textDecoration: 'underline' }}
            >
              {job.providerName}
            </Button>
            </Typography>
          </CardContent>
          <img src={job.images || card1} alt="Job" className='custom-image' style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
          <CardContent className='custom-content'>
            <Typography variant="body2" color="text.secondary" style={{ color: '#fff' }}>
              <strong>Job Title:</strong> {job.jobTitle}
            </Typography>
            <Typography gutterBottom variant="h6" component="div" className='job-title' style={{ color: '#fff' }}>
              {job.jobTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" style={{ color: '#fff' }}>
              <strong>Payment:</strong> {job.payment}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className='custom-actions'>
          <Button
            size="small"
            className='ignore-button'
            style={{ color: '#fff', backgroundColor: '#888', borderColor: '#888' }}
            onClick={handleCloseDialog}
          >
            Ignore
          </Button>
          <Button
            size="small"
            className='apply-button'
            style={{ color: '#fff', backgroundColor: '#000', borderColor: '#000' }}
            onClick={handleSubmitApplication}
          >
            Apply
          </Button>
        </CardActions>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} PaperProps={{ style: { backgroundColor: '#fff', color: '#000' } }} className='dialog'>
        <DialogTitle style={{ color: '#000' }}>Job Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Job Title:</strong> {job.jobTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Type of Job:</strong> {job.jobType}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Payment:</strong> {job.payment}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>People Needed:</strong> {job.peopleNeeded}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Location:</strong> {job.location}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Date:</strong> {job.date}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Time:</strong> {job.time}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Negotiability:</strong> {job.negotiability}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Description:</strong> {job.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#555' }}>
            <strong>Additional Details:</strong> {job.additionalDetails}
          </Typography>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} style={{ color: '#000' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CarderSeeker;
