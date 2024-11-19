import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';

function CarderProvider({ job, locations, fetchJobs }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editedJob, setEditedJob] = useState({ ...job });
  const [isNegotiable, setIsNegotiable] = useState(job.negotiability === 'Negotiable');
  const navigate = useNavigate();

  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditedJob({ ...job });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedJob(prevJob => ({
      ...prevJob,
      [name]: value
    }));
  };

  const handleNegotiabilityChange = (e) => {
    const negotiable = e.target.checked;
    setIsNegotiable(negotiable);
    setEditedJob(prevJob => ({
      ...prevJob,
      negotiability: negotiable ? 'Negotiable' : 'Non Negotiable'
    }));
  };

  const handleEditSubmit = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.put(`https://nagaconnect-iitbilai.onrender.com/jobProvider/editJob/${job.id}`, editedJob, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log(response.data);
          alert(response.data.message);
          fetchJobs();
          setEditDialogOpen(false);
        })
        .catch(error => {
          console.error('Error updating job:', error);
        });
    }
  };

  const handleDeleteClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.delete(`https://nagaconnect-iitbilai.onrender.com/jobProvider/deleteJob/${job.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          alert('Job deleted successfully');
          console.log(response.data);
          fetchJobs();
        })
        .catch(error => {
          console.error('Error deleting job:', error);
        });
    } else {
      console.log("Please Login First");
    }
  };

  return (
    <div className="m-4">
      <Card 
        sx={{ 
          maxWidth: 345, 
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)', 
          borderRadius: '16px', 
          transition: 'transform 0.3s ease',
          '&:hover': { 
            transform: 'scale(1.02)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)' 
          }
        }}
      >
        {/* Gradient Overlay Image */}
        <div 
          style={{
            position: 'relative',
            height: '200px',
            backgroundImage: `url(${job.images || '/default-job.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
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
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {job.jobTitle}
          </Typography>
        </div>

        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="body1" color="text.secondary">
              💰 {job.payment}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              👥 {job.peopleNeeded} Needed
            </Typography>
          </div>

          <div 
            className="flex flex-d-r justify-between" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }} // Added inline styles
          >
            <Button
              variant="contained"
              fullWidth
              onClick={handleCardClick}
              sx={{
                backgroundColor: '#000',
                '&:hover': { backgroundColor: '#333' },
                flex: 1 // Ensures this button takes up the remaining space
              }}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClick}
              sx={{
                minWidth: 'auto', // Keeps button width minimal for the emoji
                flex: 'none', // Prevents stretching
              }}
            >
              🗑️
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Detailed Job Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {job.jobTitle}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Job Type', value: job.jobType },
              { label: 'Payment', value: job.payment },
              { label: 'People Needed', value: job.peopleNeeded },
              { label: 'Location', value: job.location },
              { label: 'Date', value: job.date },
              { label: 'Time', value: job.time },
            ].map(({ label, value }) => (
              <div key={label} className="border-b pb-2">
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {value}
                </Typography>
              </div>
            ))}
          </div>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 2, fontStyle: 'italic' }}
          >
            {job.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDialogOpen(false);
              setEditDialogOpen(true);
            }}
            variant="contained"
            sx={{
              backgroundColor: '#000',
              '&:hover': { backgroundColor: '#333' }
            }}
          >
            Edit Job
          </Button>
          <Button 
            onClick={() => navigate(`/job-provider/application/${job.id}`)}
            variant="outlined"
          >
            View Applications
          </Button>
        </DialogActions>
      </Dialog>



      {/* Edit Job Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Edit Job
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              fullWidth
              label="Job Title"
              name="jobTitle"
              value={editedJob.jobTitle}
              onChange={handleEditChange}
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <label id="job-type-label">Type of Job</label>
            <Select
              labelId="job-type-label"
              name="jobType"
              value={editedJob.jobType}
              onChange={handleEditChange}
            >
              <MenuItem value="construction">Construction</MenuItem>
              <MenuItem value="factoryWork">Factory work</MenuItem>
              <MenuItem value="agriculture">Agriculture</MenuItem>
              <MenuItem value="transportation">Transportation</MenuItem>
              <MenuItem value="domesticWork">Domestic work</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Payment"
            name="payment"
            value={editedJob.payment}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="People Needed"
            name="peopleNeeded"
            value={editedJob.peopleNeeded}
            onChange={handleEditChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <label id="location-label">Location</label>
            <Select
              labelId="location-label"
              name="location"
              value={editedJob.location}
              onChange={handleEditChange}
            >
              {locations.map((location, index) => (
                <MenuItem key={index} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={editedJob.date}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Time"
            type="time"
            name="time"
            value={editedJob.time}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={editedJob.description}
            onChange={handleEditChange}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isNegotiable}
                onChange={handleNegotiabilityChange}
                name="negotiability"
              />
            }
            label="Negotiable"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CarderProvider;