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
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import card1 from './assets/card1.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CarderProvider({ job, locations, fetchJobs }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editedJob, setEditedJob] = useState({ ...job });
  const [isNegotiable, setIsNegotiable] = useState(job.negotiability === 'Negotiable');
  const [jobid,setJobid]=useState("")
  const navigate=useNavigate()

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
      axios.delete(`http://localhost:3001/jobProvider/deleteJob/${job.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
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
      axios.put(`http://localhost:3001/jobProvider/editJob/${job.id}`, editedJob, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log(response.data);
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
  const handleApplications=()=>{
    navigate(`/job-provider/application/${job.id}`);
  }

  return (
    <div>
      <Card sx={{ maxWidth: 345 }} className='card'>
        <CardActionArea onClick={handleCardClick}>
          <img src={card1} alt="Avatar" className='image' />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {job.jobTitle}
            </Typography>
            <p className='card_header_comp'>Job Type: {job.jobType}</p>
            <p className='card_header_comp'>Date: {job.date}</p>
            <p className='card_header_comp'>Time: {job.time}</p>
            <Typography variant="body2" color="text.secondary">
              {job.description}
            </Typography>
            <h4 className='card_header_comp'>Payment: {job.payment}</h4>
            <h4 className='card_header_comp'>Location: {job.location}</h4>
            <h4 className='card_header_comp'>Worker Capacity: {job.peopleNeeded}</h4>
            <h4 className='card_header_comp'>Negotiability: {job.negotiability}</h4>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
          <Button size="small" color="primary" onClick={handleDeleteClick}>
            Delete
          </Button>
          <Button size="small" color="primary" onClick={handleApplications}>
            Applications
          </Button>
        </CardActions>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Additional Details</DialogTitle>
        <DialogContent>
          <h2>Description</h2>
          <p>{job.additionalDetails}</p>
          <Typography variant="body2" color="text.secondary">
            {/* Additional details content */}
          </Typography>
        </DialogContent>
        <DialogActions>
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