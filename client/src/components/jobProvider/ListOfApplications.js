import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Container } from '@mui/material';

function ListOfApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`http://localhost:3001/jobProvider/applications/${jobId}`, {
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
  function  handlechat(phonenum) {
    console.log(phonenum)
    return `https://wa.me/+91${phonenum}`
  }

  return (
    <div>
      <h1>Applications for Job ID: {jobId}</h1>
      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        <Container>
        <Grid container spacing={3}>
            {applications.map(application => (
            <Grid item xs={12} sm={6} md={4} key={application.id}>
                <Card>
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
                    <a className="btn btn-success" href={handlechat(application.phone)} target="_blank" rel="noopener noreferrer">Chat</a>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        
        </Container>
      )}
    </div>
  );
}

export default ListOfApplications;
