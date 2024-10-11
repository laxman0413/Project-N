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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CarderProvider from './CarderProvider';
import Pagination from '@mui/material/Pagination';

function JobProviderDashboard() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showCustomJobType, setShowCustomJobType] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const jobsPerPage = 8;
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const locations = [
    "Dobinala Junction",
    "Ara mile",
    "Marwari Patti",
    "Police Point",
    "Toluvi Junction Purana Bazar",
    "City Tower",
    "D. C. Court"
  ];

  let { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      jobType: 'construction',
      negotiability: false,
      location: '',
      jobTitle: '',
      payment: '',
      peopleNeeded: '',
      date: '',
      time: '',
      customJobType: '',
    }
  });
  

  const fetchJobs = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://nagaconnect-iitbilai.onrender.com/jobProvider/jobs', {
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
      navigate("/job-provider/login");
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
    const jobType = e.target.value;
    setShowCustomJobType(jobType === 'others');
    setValue('jobType', jobType);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImg(file);
    } else {
      setErr("Please upload a valid image file (jpg, png, etc.)");
    }
  };

  const formSubmit = (jobDetails) => {
    const token = localStorage.getItem('token');
    jobDetails.negotiability = jobDetails.negotiabili7ty ? 'Negotiable' : 'Non Negotiable';
    const formData = new FormData();
    formData.append("jobDetails", JSON.stringify(jobDetails));
    formData.append("image", selectedImg);

    if (token) {
      axios.post('https://nagaconnect-iitbilai.onrender.com/jobProvider/addJob', formData, {
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

  const jobType = watch("jobType");

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#f8f9fa' }}>
        <Menu />
        <button className="btn btn-primary" onClick={handlePostJobClick}>Post a Job</button>
      </div>
      
      <div style={{ paddingTop: '100px' }}> {/* To avoid content hiding behind the fixed header */}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Post a Job</DialogTitle>
          <DialogContent>
            <div className="container col-l1 col-sm-8 col-md-6 mx-auto mt-3">
            <form onSubmit={handleSubmit(formSubmit)}>
              <div className="mb-3">
                <label htmlFor="jobTitle">Job Title</label>
                <input
                  type="text"
                  id="jobTitle"
                  className="form-control"
                  {...register("jobTitle", { required: "Job title is required" })}
                />
                {errors.jobTitle && <p className="text-danger">{errors.jobTitle.message}</p>}
              </div>

              <div className="mb-3">
                <FormControl fullWidth margin="normal">
                  <label id="job-type-label">Type of Job</label>
                  <Select
                    labelId="job-type-label"
                    name="jobType"
                    value={jobType}
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
                    {...register("customJobType", { required: "Custom job type is required when 'Others' is selected" })}
                    margin="normal"
                  />
                )}
                {errors.customJobType && <p className="text-danger">{errors.customJobType.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="payment">Wage per day(in INR)</label>
                <input
                  type="text"
                  id="payment"
                  className="form-control"
                  {...register("payment", { required: "Payment is required" })}
                />
                {errors.payment && <p className="text-danger">{errors.payment.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="peopleNeeded">People Needed for this job:</label>
                <input
                  type="text"
                  id="peopleNeeded"
                  className="form-control"
                  {...register("peopleNeeded", { required: "Number of people needed is required" })}
                />
                {errors.peopleNeeded && <p className="text-danger">{errors.peopleNeeded.message}</p>}
              </div>

              <div className="mb-3">
                <FormControl fullWidth margin="normal">
                  <label id="location-label">Location</label>
                  <Select
                    labelId="location-label"
                    id="location"
                    {...register("location", { required: "Location is required" })}
                  >
                    {locations.map((location, index) => (
                      <MenuItem key={index} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.location && <p className="text-danger">{errors.location.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="date">Job Date</label>
                <input
                  type="date"
                  id="date"
                  className="form-control"
                  {...register("date", { required: "Job date is required" })}
                />
                {errors.date && <p className="text-danger">{errors.date.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  className="form-control"
                  {...register("time")}
                />
              </div>

              <div className="mb-3">
                <FormControlLabel
                  control={
                    <Checkbox {...register("negotiability")} />
                  }
                  label="Negotiable"
                />
              </div>

              <div className="mb-3">
              <label htmlFor="image">job Image</label>
              <input
                type="file"
                name="image"
                id="image"
                className={`form-control ${errors.image ? 'input-error' : ''}`}
                onChange={handleImg}
                required
              />
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
          {currentJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <CarderProvider job={job} locations={locations} fetchJobs={fetchJobs} />
              {/* Insert ads at the 3rd and 7th positions on each page */}
              {(index === 2 || index === 6) && <div className="advertisement">Advertisement</div>}
            </React.Fragment>
          ))}
        </div>

        <Pagination
          count={Math.ceil(jobs.length / jobsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />
      </div>
    </div>
  );
}

export default JobProviderDashboard;
