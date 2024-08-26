import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Container, Button, Box } from '@mui/material';
import Menu from './Menu';

function ListOfApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`https://nagaconnect-iitbilai.onrender.com/jobProvider/applications/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setApplications(response.data);
        })
        .catch(error => {
          console.error('Error fetching applications:', error);
        });
    } else {
      console.log("Please Login First");
    }
  }, [jobId]);

  const handleChat = (phoneNum) => {
    return `https://wa.me/+91${phoneNum}`;
  };

  return (
    <div>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#f8f9fa' }}>
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
            <Grid item xs={12} sm={6} md={4} key={application.id}>
              <Card sx={{ minHeight: 180 }}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    </div>
  );
}

export default ListOfApplications;
