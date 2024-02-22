import React, { useState } from 'react';
import Menu from './Menu';
import Carder from './Carder';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './JobProvider.css';

function JobProvider() {
  // State to manage modal visibility
  const [isModalOpen, setModalOpen] = useState(false);

  // Job Details Form State
  const [jobDetails, setJobDetails] = useState({
    jobTitle: '',
    jobType: '',
    customJobType: '', // Added for Others option
    payment: '',
    peopleNeeded: '',
    location: '',
    date: '',
    time: '',
  });

  // Function to handle "Post a Job" button click and open modal
  const handlePostJobClick = () => {
    setModalOpen(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Function to handle form submission (you can customize this)
  const handleFormSubmit = () => {
    // Add form submission logic
    console.log('Job Details:', jobDetails);
    handleCloseModal();
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

            <TextField
              fullWidth
              label="Location (GPS)"
              name="location"
              value={jobDetails.location}
              onChange={handleInputChange}
              margin="normal"
            />

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
      <Carder />
      <Carder />
      <Carder />
    </div>
  );
}

export default JobProvider;
