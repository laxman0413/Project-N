import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Typography } from '@mui/material';
import './Admin.css';
import Menu from './Menu';

function Admin() {
  // State to manage modal visibility and complaint description
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState('');

  // Sample statistics data (you can replace this with actual data)
  const statisticsData = {
    totalUsers: 1000,
    totalJobsPosted: 500,
    totalComplaints: 10,
  };

  // Sample complaints data (you can replace this with actual data)
  const complaintsData = [
    {
      id: 1,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 2,
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    // Add more complaints as needed
  ];

  // Function to handle complaint box click and open modal
  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint.description);
    setModalOpen(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
        <Menu />
    <div className="admin-container">
        
      <div className="statistics-container">
        <h2>Statistics</h2>
        <div className="statistic-card">
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="body1">{statisticsData.totalUsers}</Typography>
            </CardContent>
          </Card>
        </div>

        <div className="statistic-card">
          <Card>
            <CardContent>
              <Typography variant="h6">Total Jobs Posted</Typography>
              <Typography variant="body1">{statisticsData.totalJobsPosted}</Typography>
            </CardContent>
          </Card>
        </div>

        <div className="statistic-card">
          <Card>
            <CardContent>
              <Typography variant="h6">Total Complaints</Typography>
              <Typography variant="body1">{statisticsData.totalComplaints}</Typography>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="complaints-container">
        <h2>Complaints</h2>
        <div className="complaint-box-container">
          {complaintsData.map((complaint) => (
            <div key={complaint.id} className="complaint-box" onClick={() => handleComplaintClick(complaint)}>
              {complaint.description}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for complaint description */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Complaint Description</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedComplaint}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>
  );
}

export default Admin;
