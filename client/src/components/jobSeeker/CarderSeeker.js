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
import './CarderSeeker.css';
import Swal from 'sweetalert2';
function showAlertSuccess(data){
  Swal.fire({
    title: data,
    confirmButtonText: 'OK'
  })
}
function showAlertError(data){
  Swal.fire({
    title: data,
    icon: 'error',
    confirmButtonText: 'OK'
  })
}
function CarderSeeker({ job, fetchJobs }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [application, setApplication] = useState('');
  const [isVisible, setIsVisible] = useState(true); // Tracks if the job is visible
  const navigate = useNavigate();

  const handleCardClick = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSubmitApplication = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .post(
          `https://nagaconnect-iitbilai.onrender.com/jobSeeker/apply/${job.id}`,
          { application },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          showAlertSuccess('Job applied successfully');
          fetchJobs();
        })
        .catch((error) => {
          console.error('Error submitting application:', error);
        });

        axios.post(
          'http://localhost:3001/notifications/create',
          {
            receiverId: job.providerId,
            data: `You have a new application for the job: ${job.jobTitle}`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(()=>{
          console.log('Notification sent successfully');
        }).catch((error)=>{
          console.error('Error submitting application:', error);
        })
    } else {
      showAlertError('Please Login First');
    }
  };

  const handleIgnoreJob = () => setIsVisible(false); // Hides the job card

  if (!isVisible) return null; // Do not render if the job is ignored

  return (
    <div style={{ marginBottom: '20px' }}>
      <Card
        sx={{
          maxWidth: 345,
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
          },
        }}
        className="custom-card"
      >
        <CardActionArea onClick={handleCardClick}>
          {/* Gradient Overlay Image */}
          <div
            style={{
              position: 'relative',
              height: '200px',
              backgroundImage: `url(${job.images || card1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              }}
            />
            <Typography
              variant="h5"
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                color: 'white',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {job.jobTitle}
            </Typography>
          </div>

          <CardContent>
            <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Job Posted by:{' '}
              <Button
                onClick={() =>
                  job.providerId
                    ? navigate(`/ppprofile/${job.providerId}`)
                    : console.error('providerID is undefined!')
                }
                style={{
                  color: '#1976d2',
                  textDecoration: 'underline',
                  padding: '0',
                  fontSize: '0.9rem',
                }}
              >
                {job.providerName}
              </Button>
            </Typography>
            <Typography variant="h6" style={{ marginBottom: '8px' }}>
              {job.location}
            </Typography>
            <Typography variant="body2" style={{ color: '#555' }}>
              <strong>Payment:</strong> {job.payment}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions
          sx={{
            padding: '16px',
            justifyContent: 'space-between',
            borderTop: '1px solid #eee',
          }}
        >
          <Button
            onClick={handleIgnoreJob} // Ignore functionality
            style={{
              color: '#f44336',
              fontWeight: 'bold',
            }}
          >
            Ignore
          </Button>
          <Button
            onClick={handleSubmitApplication}
            style={{
              backgroundColor: '#1976d2',
              color: '#fff',
              fontWeight: 'bold',
              padding: '6px 16px',
              borderRadius: '20px',
              boxShadow: '0 2px 4px rgba(25, 118, 210, 0.4)',
            }}
          >
            Apply
          </Button>
        </CardActions>
      </Card>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      >
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {[
            { label: 'Job Title', value: job.jobTitle },
            { label: 'Type of Job', value: job.jobType },
            { label: 'Payment', value: job.payment },
            { label: 'People Needed', value: job.peopleNeeded },
            { label: 'Location', value: job.location },
            { label: 'Date', value: job.date },
            { label: 'Time', value: job.time },
            { label: 'Negotiability', value: job.negotiability },
            {
              label: 'Description',
              value: job.description || 'No description provided',
            },
            {
              label: 'Additional Details',
              value: job.additionalDetails || 'No additional details provided',
            },
          ].map((detail, index) => (
            <Typography key={index} variant="body2" style={{ marginBottom: '10px' }}>
              <strong>{detail.label}:</strong> {detail.value}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CarderSeeker;
