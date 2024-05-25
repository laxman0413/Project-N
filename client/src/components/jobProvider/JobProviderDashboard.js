import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CarderProvider from './CarderProvider';

function JobProviderDashboard() {
  let { register, handleSubmit } = useForm({
    defaultValues: {
      jobType: 'construction',
    }
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [showCustomJobType, setShowCustomJobType] = useState(false);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const locations = [
    "Dobinala Junction",
    "Ara mile",
    "Marwari Patti",
    "Police Point",
    "Toluvi Junction Purana Bazar",
    "City Tower",
    "D. C. Court"
  ];

  const fetchJobs = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3001/jobProvider/jobs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setJobs(response.data);
        })
        .catch(error => {
          console.error('Error fetching jobs:', error);
        });
    } else {
      console.log("Please Login First");
      navigate("/job-provider/login")
    }
  }, [navigate]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handlePostJobClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowCustomJobType(false);
  };

  const handleJobTypeChange = (e) => {
    setShowCustomJobType(e.target.value === 'others');
  };

  const formSubmit = (jobDetails) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://localhost:3001/jobProvider/addJob', jobDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log(response.data);
          fetchJobs(); // Refresh the job list
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
    } else {
      console.log("Please Login First");
      navigate("/job-provider/login");
    }
  };

  return (
    <div>
      <Menu />
      <button className='btn btn-primary' onClick={handlePostJobClick}>Post a Job </button>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Post a Job</DialogTitle>
        <DialogContent>
          <div className="container col-l1 col-sm-8 col-md-6 mx-auto mt-3">
            <form onSubmit={handleSubmit(formSubmit)}>
              <div className="mb-3">
                <label htmlFor="jobTitle">Job Title</label>
                <input type="text" id="jobTitle" className="form-control" {...register("jobTitle")} required></input>
              </div>
              <div className="mb-3">
                <FormControl fullWidth margin="normal">
                  <label id="job-type-label">Type of Job</label>
                  <Select
                    labelId="job-type-label"
                    name="jobType"
                    {...register("jobType")}
                    onChange={handleJobTypeChange}
                  >
                    <MenuItem value="construction">Construction</MenuItem>
                    <MenuItem value="factoryWork">Factory work</MenuItem>
                    <MenuItem value="agriculture">Agriculture</MenuItem>
                    <MenuItem value="transportation">Transportation</MenuItem>
                    <MenuItem value="domesticWork">Domestic work</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
                {showCustomJobType && (
                  <TextField
                    fullWidth
                    label="Custom Job Type"
                    {...register("customJobType")}
                    margin="normal"
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="payment">Payment</label>
                <input type="text" id="payment" className="form-control" {...register("payment")} required></input>
              </div>
              <div className="mb-3">
                <label htmlFor="peopleNeeded">People Needed</label>
                <input type="number" id="peopleNeeded" className="form-control" {...register("peopleNeeded")} required></input>
              </div>
              <div className="mb-3">
                <FormControl fullWidth margin="normal">
                  <label id="location-label">Location</label>
                  <Select
                    labelId="location-label"
                    id="location"
                    label="Location"
                    {...register("location")}
                  >
                    {locations.map((location, index) => (
                      <MenuItem key={index} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="mb-3">
                <label htmlFor="date">Job Date</label>
                <input type="date" id="date" className="form-control" {...register("date")} required></input>
              </div>
              <div className="mb-3">
                <label htmlFor="time">Time</label>
                <input type="time" id="time" className="form-control" {...register("time")}></input>
              </div>
              <button className="btn btn-success" type="submit">Register</button>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <h2>Previous Jobs</h2>
      <div className="job-list">
        {jobs.map(job => (
          <CarderProvider key={job.id} job={job} locations={locations} fetchJobs={fetchJobs} />
        ))}
      </div>
    </div>
  );
}

export default JobProviderDashboard;
