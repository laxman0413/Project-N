// frontend/src/JobProvider.js
import React, { useState,useEffect } from 'react';
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
  let {register,handleSubmit}=useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate=useNavigate();
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

  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    // Fetch job details and available locations from the backend when the component mounts
    const token=localStorage.getItem("token");
    if(token===null){
      navigate("/job-provider/login")
    }else{
    axios.get('http://localhost:3001/jobProvider/getjobs',{headers:{Authorization:'Bearer '+token}})
      .then(response => {
        console.log(response.data);  // Log response data to debug
        if (response.data && response.data.recordsets && Array.isArray(response.data.recordsets[0])) {
          const jobsData = response.data.recordset;
          setJobs(jobsData);
        } else {
          console.error('Error: Expected an object with recordsets array but got', typeof response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
      });
    }
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const formSubmit = (jobDetails) => {
    const token = localStorage.getItem('token');
    if(token){
    axios.post('http://localhost:3001/jobProvider/addJob',jobDetails,{
      headers: {
        Authorization: `Bearer ${token}`
      }})
      .then(response => {
        console.log(response.data);
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
    }else{
      console.log("Please Login First");
      navigate("/job-provider/login")
    }
  };
  let other=0;
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
              <label htmlFor="Job Title">Job Title</label>
              <input type="text" name="Job Title" id="Job Title" className="form-control" {...register("jobTitle")} required></input>
            </div>
            <div className="mb-3">
            <FormControl fullWidth margin="normal">
              <label id="job-type-label">Type of Job</label>
              <Select
                labelId="job-type-label"
                name="jobType"
                {...register("jobType")}
              >
                <MenuItem value="construction">Construction</MenuItem>
                <MenuItem value="factoryWork">Factory work</MenuItem>
                <MenuItem value="agriculture">Agriculture</MenuItem>
                <MenuItem value="transportation">Transportation</MenuItem>
                <MenuItem value="domesticWork">Domestic work</MenuItem>
                <MenuItem value="others" onClick={other=1}>Others</MenuItem>
              </Select>
            </FormControl>
            {(other==1)?(
              <TextField
                fullWidth
                label="Custom Job Type"
                {...register("customJobType")}
                margin="normal"
              />
            ):{}}
            </div>
            <div className="mb-3">
              <label htmlFor="Payment">Payment</label>
              <input type="Text"  id="Payment" className="form-control" {...register("payment")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="PeopleNeeded">PeopleNeeded</label>
              <input type="number"  id="PeopleNeeded" className="form-control" {...register("peopleNeeded")} required></input>
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
              <input type="date"  id="date" className="form-control" {...register("date")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="time">Time</label>
              <input type="time" name="time" id="time" className="form-control" {...register("time")}></input>
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
      {jobs.map((job, index) => (
        <CarderProvider key={index} job={job} />
      ))}
    </div>
  );
}

export default JobProviderDashboard;
