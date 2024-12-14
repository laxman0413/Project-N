import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Button,
  Box,
  Modal,
  TextField,
  MenuItem,
} from '@mui/material';
import Menu from './Menu';

function ListOfApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`https://nagaconnect-iitbilai.onrender.com/jobProvider/applications/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setApplications(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching applications:', error);
        });
    } else {
      console.log('Please Login First');
    }
  }, [jobId]);

  const handleChat = (phoneNum) => {
    return `https://wa.me/+91${phoneNum}`;
  };

  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setApplicationStatus(application.ApplicationStatus || 'Pending');
    setOpenModal(true);
  };

  const handleUpdateStatus = () => {
    const token = localStorage.getItem('token');
    if (selectedApplication && token) {
      axios
        .put(
          `https://nagaconnect-iitbilai.onrender.com/jobProvider/applications/${selectedApplication.application_id}/updateStatus`,
          { ApplicationStatus: applicationStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          // Update application status locally
          setApplications((prev) =>
            prev.map((app) =>
              app.application_id === selectedApplication.application_id
                ? { ...app, ApplicationStatus: applicationStatus }
                : app
            )
          );
  
          // Close modal
          setOpenModal(false);
  
          // Send notification if status is "Shortlisted"
          if (applicationStatus === "Shortlisted") {
            console.log('Sending notification...');
            console.log(selectedApplication.seekerId);
            axios
              .post(
                'https://nagaconnect-iitbilai.onrender.com/notifications/create',
                {
                  receiverId: selectedApplication.seekerId, // Use seeker_id from the selected application
                  data: `Your application for job ID ${jobId} has been accepted`,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then(() => {
                console.log('Notification sent');
              })
              .catch((error) => {
                console.error('Error sending notification:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error updating status:', error);
        });
    }
  };
  

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          backgroundColor: '#f8f9fa',
        }}
      >
        <Menu />
      </div>
      <pre> </pre>
      <pre> </pre>
      <Container>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <h2 variant="h4" gutterBottom>
            Applications for Job ID: {jobId}
          </h2>
        </Box>
        {applications.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            No applications found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {applications.map((application) => (
              <Grid item xs={12} sm={6} md={4} key={application.application_id}>
                <Card sx={{ minHeight: 220 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {application.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Sex:</strong> {application.sex}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Age:</strong> {application.age}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Phone:</strong> {application.phone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Status:</strong> {application.ApplicationStatus || 'Pending'}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          navigate(`/spprofile/${application.seeker_id}`);
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ width: '100%' }}
                      >
                        View profile
                      </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        href={handleChat(application.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ width: '100%' }}
                      >
                        Chat
                      </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleEditClick(application)}
                        sx={{ width: '100%' }}
                      >
                        Edit Status
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Update Status
          </Typography>
          <TextField
            select
            label="Status"
            value={applicationStatus}
            onChange={(e) => setApplicationStatus(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shortlisted">Select for Job</MenuItem>
            <MenuItem value="Rejected">Reject person</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateStatus}
            fullWidth
          >
            Update
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ListOfApplications;
