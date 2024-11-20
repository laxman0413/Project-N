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
  Checkbox,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CarderProvider from './CarderProvider';
import Pagination from '@mui/material/Pagination';
import './JobProviderDashboard.css';

function JobProviderDashboard() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
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

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
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
    },
    resolver: async (data) => {
      const errors = {};
      
      if (!data.jobTitle?.trim()) {
        errors.jobTitle = { message: "Job title is required" };
      }
      
      if (!data.payment?.trim()) {
        errors.payment = { message: "Payment is required" };
      } else if (isNaN(data.payment)) {
        errors.payment = { message: "Payment must be a number" };
      }
      
      if (!data.peopleNeeded?.trim()) {
        errors.peopleNeeded = { message: "Number of people needed is required" };
      } else if (isNaN(data.peopleNeeded)) {
        errors.peopleNeeded = { message: "Must be a number" };
      }
      
      if (!data.location) {
        errors.location = { message: "Location is required" };
      }
      
      if (!data.date) {
        errors.date = { message: "Date is required" };
      }
      
      if (data.jobType === 'others' && !data.customJobType?.trim()) {
        errors.customJobType = { message: "Custom job type is required" };
      }

      return {
        values: data,
        errors: Object.keys(errors).length > 0 ? errors : {}
      };
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
  const handleCloseTicketModal = () => {
    setTicketModalOpen(false);
  };
  const handlePostJobClick = () => setModalOpen(true);

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowCustomJobType(false);
    setErr("");
    setSelectedImg(null);
    reset();
  };

  const handleJobTypeChange = (e) => {
    const jobType = e.target.value;
    setShowCustomJobType(jobType === "others");
    setValue("jobType", jobType);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setErr("Invalid image. Ensure it's less than 5MB and of type jpg, png, etc.");
      setSelectedImg(null);
      return;
    }
    
    setErr("");
    setSelectedImg(file);
  };

  const formSubmit = async (jobDetails) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/job-provider/login");
      return;
    }
    if (!selectedImg) {
      setErr("Please select an image");
      return;
    }
    try {
      const formData = new FormData();
      formData.append(
        "jobDetails",
        JSON.stringify({
          ...jobDetails,
          negotiability: jobDetails.negotiability ? "Negotiable" : "Non-Negotiable",
          jobType: jobDetails.jobType === "others" ? jobDetails.customJobType : jobDetails.jobType,
        })
      );
      formData.append("image", selectedImg);

      await axios.post(
        "https://nagaconnect-iitbilai.onrender.com/jobProvider/addJob",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      alert("Job posted successfully!");
      fetchJobs();
      handleCloseModal();
    } catch (error) {
      setErr(error.response?.data?.message || "Error posting job. Please try again.");
    }
  };
  const handleTicketSubmit = (ticketData) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('https://nagaconnect-iitbilai.onrender.com/jobProvider/RaiseTicket', 
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
        .then(response => {
          alert('Ticket raised successfully!');
          console.log('Ticket raised successfully:', response.data);
          handleCloseTicketModal();
        })
        .catch(error => {
          console.error('Error raising ticket:', error);
          alert('Error raising ticket. Please try again.');
        });
    } else {
      console.log("Please Login First");
      navigate("/job-provider/login");
    }
  };

  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="dashboard">
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#f8f9fa' }}>
        <Menu />
      </div>
        <pre> </pre>
        <pre> </pre>

        <div className="dashboard-actions">
          <Button variant="outlined" onClick={() => setTicketModalOpen(true)} sx={{ color: "black" }}>
            Raise a Ticket
          </Button>
          <Button variant="contained" onClick={handlePostJobClick} sx={{ backgroundColor: "black", color: "white" }}>
            Post a Job
          </Button>
        </div>
      <pre> </pre>
      <div className="dashboard-content">
        <Typography variant="h4" sx={{ color: "black", textAlign: "center", marginBottom: 2 }}>
          previous Job Listings
        </Typography>
        <div className="job-list">
          {currentJobs.map((job, index) => (
            <CarderProvider key={job.id} job={job} locations={locations} fetchJobs={fetchJobs} />
          ))}
        </div>
        <Pagination
          count={Math.ceil(jobs.length / jobsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            "& .MuiPaginationItem-root": { color: "black" },
          }}
        />
      </div>

      <div style={{ paddingTop: '100px' }}>
        {/* Ticket Modal */}
        <Dialog open={isTicketModalOpen} onClose={handleCloseTicketModal}>
          <DialogTitle>Raise a Ticket</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleTicketSubmit)}>
              <div className="mb-3">
                <label htmlFor="title">Title:</label><br />
                <input type='text' id='title' {...register("title", { required: "Title is required" })} /> <br />
                <label htmlFor="description">Issue Description</label>
                <TextField
                  fullWidth
                  id="description"
                  {...register("description", { required: "description is required" })}
                  multiline
                  rows={4}
                />
                {errors.issue && <Typography color="error">{errors.issue.message}</Typography>}
              </div>
              <button type="submit" className="btn btn-success">Submit Ticket</button>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTicketModal}>Cancel</Button>
          </DialogActions>
        </Dialog>

      {/* Job Posting Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Post a Job</DialogTitle>
          <DialogContent>
            <div className="container col-l1 col-sm-8 col-md-6 mx-auto mt-3">
              <form onSubmit={handleSubmit(formSubmit)} encType="multipart/form-data">
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

            <FormControl fullWidth margin="normal">
              <label>Type of Job</label>
              <Select
                value={jobType}
                onChange={handleJobTypeChange}
                error={!!errors.jobType}
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
                margin="normal"
                {...register("customJobType", { 
                  required: "Custom job type is required when 'Others' is selected" 
                })}
                error={!!errors.customJobType}
                helperText={errors.customJobType?.message}
              />
            )}

            <TextField
              fullWidth
              label="Wage per day (in INR)"
              margin="normal"
              type="number"
              {...register("payment", { 
                required: "Payment is required",
                min: { value: 1, message: "Payment must be greater than 0" }
              })}
              error={!!errors.payment}
              helperText={errors.payment?.message}
            />

            <TextField
              fullWidth
              label="People Needed"
              margin="normal"
              type="number"
              {...register("peopleNeeded", { 
                required: "Number of people needed is required",
                min: { value: 1, message: "At least 1 person is required" }
              })}
              error={!!errors.peopleNeeded}
              helperText={errors.peopleNeeded?.message}
            />

            <FormControl fullWidth margin="normal">
              <label>Location</label>
              <Select
                {...register("location", { required: "Location is required" })}
                error={!!errors.location}
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
              label="Job Date"
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register("date", { 
                required: "Job date is required",
                validate: value => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  return selectedDate >= today || "Date cannot be in the past";
                }
              })}
              error={!!errors.date}
              helperText={errors.date?.message}
            />

            <TextField
              fullWidth
              label="Time"
              margin="normal"
              type="time"
              InputLabelProps={{ shrink: true }}
              {...register("time")}
            />

            <FormControlLabel
              control={<Checkbox {...register("negotiability")} />}
              label="Negotiable"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImg}
              className={`form-control ${err ? 'is-invalid' : ''}`}
            />
            {err && <div className="text-danger">{err}</div>}

                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={Object.keys(errors).length > 0 || !selectedImg}
                >
                  Register
                </button>
              </form>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {/* Ticket Modal */}
        <Dialog open={isTicketModalOpen} onClose={handleCloseTicketModal}>
          <DialogTitle>Raise a Ticket</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleTicketSubmit)}>
              <div className="mb-3">
                <label htmlFor="title">Title:</label><br />
                <input type='text' id='title' {...register("title", { required: "Title is required" })} /> <br />
                <label htmlFor="description">Issue Description</label>
                <TextField
                  fullWidth
                  id="description"
                  {...register("description", { required: "description is required" })}
                  multiline
                  rows={4}
                />
                {errors.issue && <Typography color="error">{errors.issue.message}</Typography>}
              </div>
              <button type="submit" className="btn btn-success">Submit Ticket</button>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTicketModal}>Cancel</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}

export default JobProviderDashboard;
