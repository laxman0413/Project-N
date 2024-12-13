import React, { useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import card1 from '../assets/card1.jpg'; // Assuming default image is in assets folder
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';
import './CarderSeekerApp.css';

function showAlertSuccess(data) {
  Swal.fire({
    title: data,
    confirmButtonText: 'OK'
  });
}

function showAlertError(data) {
  Swal.fire({
    title: data,
    icon: 'error',
    confirmButtonText: 'OK'
  });
}

function CarderSeekerApp({ job, onWithdraw }) {
  const isJobExpired = job.date && !isNaN(new Date(job.date)) && new Date(job.date) < new Date();
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
      showAlertSuccess("Job withdrawn successfully");
      onWithdraw(job.application_id);
      handleCloseDialog();
    } catch (error) {
      showAlertError('Error withdrawing job application');
      console.error('Error withdrawing job application:', error.response?.data || error.message);
    }
  };

  return (
    <div className="job-card-wrapper">
      <Card
        className={`job-card ${isJobExpired ? 'expired-job' : ''}`}
        sx={{ maxWidth: 345, backgroundColor: isJobExpired ? '#e0e0e0' : '#fff' }}
      >
        <CardActionArea onClick={!isJobExpired ? handleCardClick : undefined}>
          <div className="job-image-container">
            <img
              src={job.images || card1}
              alt="Job"
              className="job-image"
            />
            <div className="deadline-badge">
              {isJobExpired
                ? 'Expired'
                : `Deadline: ${formatDistanceToNow(new Date(job.date))} left`}
            </div>
          </div>
          <CardContent>
            <Typography
              variant="h6"
              component="div"
              className="job-title"
            >
              {job.jobTitle || 'Job Title'}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              className="job-location"
            >
              Location: {job.location || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              className="job-payment"
            >
              Payment: {job.payment?.join(', ') || 'N/A'}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions style={{ justifyContent: 'center' }}>
          <Button
            size="small"
            color="primary"
            onClick={!isJobExpired ? handleCardClick : undefined}
            disabled={isJobExpired}
          >
            {isJobExpired ? 'Not Selected' : 'View Details'}
          </Button>
        </CardActions>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Job Details
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            <strong>Job Title:</strong> {job.jobTitle}<br />
            <strong>Type of Job:</strong> {job.jobType}<br />
            <strong>Payment:</strong> {job.payment?.join(', ')}<br />
            <strong>People Needed:</strong> {job.peopleNeeded}<br />
            <strong>Location:</strong> {job.location}<br />
            <strong>Date:</strong> {job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}<br />
            <strong>Time:</strong> {job.time ? new Date(job.time).toLocaleTimeString() : 'N/A'}<br />
            <strong>Negotiability:</strong> {job.negotiability || 'Non-Negotiable'}<br />
            <strong>Description:</strong> {job.description || 'No additional description available.'}<br />
            <strong>Application Status:</strong> {job.ApplicationStatus || 'waiting'}<br />
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
