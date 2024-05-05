// frontend/src/JobProvider.js
import React, { useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import Carder from './Carder';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import './JobProvider.css';

function JobProvider() {
  const [isModalOpen, setModalOpen] = useState(false);

  const [jobDetails, setJobDetails] = useState({
    jobTitle: '',
    jobType: '',
    customJobType: '',
    payment: '',
    peopleNeeded: '',
    location: '',
    date: '',
    time: '',
  });
  const locations = [
    "Dobinala Junction",
    "Ara mile",
    "Marwari Patti",
    "Police Point",
    "Toluvi Junction Purana Bazar",
    "City Tower",
    "D. C. Court"
  ];
  const handlePostJobClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    axios.post('http://localhost:3001/addJob', jobDetails)
      .then(response => {
        console.log(response.data);
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
  };

  return (
    <div>
      <Menu />
      <button className='butn' onClick={handlePostJobClick}>Post a Job </button>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Post a Job</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              fullWidth
              label="Job Title"
              name="jobTitle"
              value={jobDetails.jobTitle}
              onChange={handleInputChange}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="job-type-label">Type of Job</InputLabel>
              <Select
                labelId="job-type-label"
                name="jobType"
                value={jobDetails.jobType}
                onChange={handleInputChange}
              >
                <MenuItem value="construction">Construction</MenuItem>
                <MenuItem value="factoryWork">Factory work</MenuItem>
                <MenuItem value="agriculture">Agriculture</MenuItem>
                <MenuItem value="transportation">Transportation</MenuItem>
                <MenuItem value="domesticWork">Domestic work</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </Select>
            </FormControl>

            {jobDetails.jobType === 'others' && (
              <TextField
                fullWidth
                label="Custom Job Type"
                name="customJobType"
                value={jobDetails.customJobType}
                onChange={handleInputChange}
                margin="normal"
              />
            )}

            <TextField
              fullWidth
              label="Payment"
              name="payment"
              value={jobDetails.payment}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Number of People Needed"
              name="peopleNeeded"
              type="number"
              value={jobDetails.peopleNeeded}
              onChange={handleInputChange}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                name="location"
                value={jobDetails.location}
                onChange={handleInputChange}
              >
                {locations.map((location, index) => (
                  <MenuItem key={index} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Job Date"
              name="date"
              type="date"
              value={jobDetails.date}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Job Time"
              name="time"
              type="time"
              value={jobDetails.time}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      <h2>Previous Jobs</h2>
      
    </div>
  );
}

export default JobProvider;
