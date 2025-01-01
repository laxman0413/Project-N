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
import AdCard from '../advertisement/AdCard';
import Swal from 'sweetalert2';
function showAlert(data){
  Swal.fire({
    title: data,
    confirmButtonText: 'OK'
  })
}
function JobProviderDashboard() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
  const [showCustomJobType, setShowCustomJobType] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [ads, setAds] = useState([]);
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

  const fetchJobs = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/job-seeker/login");
      return;
    }
    
    try {
      const [jobResponse, adsResponse] = await Promise.all([
        axios.get('https://nagaconnect-iitbilai.onrender.com/jobProvider/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://nagaconnect-iitbilai.onrender.com/advertise/getAds', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setJobs(jobResponse.data);
      setAds(adsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    setErr("");
    setSelectedImg(null);
  };

  const handleJobTypeChange = (e) => {
    const jobType = e.target.value;
    setShowCustomJobType(jobType === 'others');
    setValue('jobType', jobType);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErr("Please select an image file");
      setSelectedImg(null);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setErr("Please upload a valid image file (jpg, png, etc.)");
      setSelectedImg(null);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErr("Image size should be less than 5MB");
      setSelectedImg(null);
      return;
    }
    
    setErr("");
    setSelectedImg(file);
  };

  const formSubmit = async (jobDetails) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Please Login First");
        navigate("/job-provider/login");
        return;
      }

      // Validate required image
      if (!selectedImg) {
        setErr("Please select an image");
        return;
      }

      // Format the job details
      const formattedJobDetails = {
        ...jobDetails,
        negotiability: jobDetails.negotiability ? 'Negotiable' : 'Non Negotiable',
        jobType: jobDetails.jobType === 'others' ? jobDetails.customJobType : jobDetails.jobType
      };

      // Create FormData
      const formData = new FormData();
      formData.append("jobDetails", JSON.stringify(formattedJobDetails));
      formData.append("image", selectedImg);

      const response = await axios.post(
        'https://nagaconnect-iitbilai.onrender.com/jobProvider/addJob', 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      showAlert('Job posted successfully!');
      console.log('Job posted successfully:', response.data);
      fetchJobs(); // Refresh the job list
      handleCloseModal();
      // Optional: Add success message
      

    } catch (error) {
      console.error('Error submitting form:', error);
      setErr(error.response?.data?.message || 'Error posting job. Please try again.');
    }
  };

  const jobType = watch("jobType");

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenTicketModal = () => {
    setTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setTicketModalOpen(false);
  };

  const handleTicketSubmit = (ticketData) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('https://nagaconnect-iitbilai.onrender.com/jobProvider/RaiseTicket', {
        ...ticketData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          showAlert('Ticket raised successfully!');
          console.log('Ticket raised successfully:', response.data);
          handleCloseTicketModal();
        })
        .catch(error => {
          console.error('Error raising ticket:', error);
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
    <div>
      {/* Header Section */}
      <div style={{ width: '100%' }}>
        <Menu />
      </div>
  
      {/* Post a Job Section */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
          }}
          onClick={handlePostJobClick}
        >
          <h3 style={{ margin: '10px 0', color: '#333' }}>Post a Job</h3>
          <p style={{ fontSize: '14px', color: '#666', margin: '10px 0' }}>
            Click here to post a new job. Provide all the necessary details to make it visible to job seekers.
          </p>
          <button
            style={{
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Post Now
          </button>
        </div>
      </div>
  
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
                  <label htmlFor="image">Job Image</label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className={`form-control ${err ? 'is-invalid' : ''}`}
                    onChange={handleImg}
                    accept="image/*"
                    required
                  />
                  {err && <div className="invalid-feedback">{err}</div>}
                </div>

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
  
      {/* Job List Section */}
      <div className="job-list">
        {currentJobs.map((job, index) => (
          <React.Fragment key={job.id}>
            <div className="job-card">
              <CarderProvider job={job} locations={locations} fetchJobs={fetchJobs} />
            </div>
            {(index + 1) % 3 === 0 && ads.length > Math.floor(index / 3) && (
              <div className="ad-card">
                <AdCard ad={ads[Math.floor(index / 3)]} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
  
      {/* Pagination Section */}
      <div className="pagination-container" style={{ marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(jobs.length / jobsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
  
    }
    
    export default JobProviderDashboard;