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
  const [isTicketModalOpen, setTicketModalOpen] = useState(false); // New state for ticket modal
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
    jobDetails.negotiability = jobDetails.negotiability ? 'Negotiable' : 'Non Negotiable';
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

  const handleOpenTicketModal = () => {
    setTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setTicketModalOpen(false);
  };

  // Submit the ticket data to the backend
  const handleTicketSubmit = (ticketData) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://localhost:3001/jobProvider/RaiseTicket', {
        ...ticketData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
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
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#f8f9fa' }}>
        <Menu />
        <button className='btn btn-primary'  onClick={handleOpenTicketModal}>Raise a Ticket</button> 
        <button className="btn btn-primary" onClick={handlePostJobClick}>Post a Job</button>
      </div>
      
      <div style={{ paddingTop: '100px' }}>
        {/* Ticket Modal */}
        <Dialog open={isTicketModalOpen} onClose={handleCloseTicketModal}>
          <DialogTitle>Raise a Ticket</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleTicketSubmit)}>
              <div className="mb-3">
                <label htmlFor="title">Title:</label><br />
                <input type='text' id='title' {...register("title", { required: "Title is required" })} /> <br></br>
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
          {/* Your job posting modal content */}
        </Dialog>

        <h2>Previous Jobs</h2>
        <div className="job-list">
          {currentJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <CarderProvider job={job} locations={locations} fetchJobs={fetchJobs} />
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
