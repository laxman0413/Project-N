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
  FormControl,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import card1 from './assets/card1.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CarderProvider.css'; // Import the CSS file for custom styles

function CarderProvider({ job, locations, fetchJobs }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editedJob, setEditedJob] = useState({ ...job });
  const [isNegotiable, setIsNegotiable] = useState(job.negotiability === 'Negotiable');
  const navigate = useNavigate();

  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedJob({ ...editedJob, [name]: value });
  };

  const handleNegotiabilityChange = (e) => {
    setIsNegotiable(e.target.checked);
    setEditedJob({ ...editedJob, negotiability: e.target.checked ? 'Negotiable' : 'Non Negotiable' });
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
          alert("Job Edited successfully");
          fetchJobs();
          handleEditClose();
        })
        .catch(error => {
          console.error('Error updating job:', error);
        });
    } else {
      console.log("Please Login First");
    }
  };

  const handleApplications = () => {
    navigate(`/job-provider/application/${job.id}`);
  };

  return (
    <div>
      <Card className='custom-card'>
        <CardActionArea onClick={handleCardClick}>
          <img src={job.images || card1} alt="Avatar" className='custom-image' />
          <CardContent>
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
          <Button size="small" className='ignore-button' onClick={handleDeleteClick}>
            Delete
          </Button>
          <Button size="small" className='apply-button' onClick={handleApplications}>
            View Applications
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
          <Button onClick={handleEditClick}>Edit</Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Job</DialogTitle>
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
