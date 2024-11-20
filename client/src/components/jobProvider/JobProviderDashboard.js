import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Menu from "./Menu";
import { useForm } from "react-hook-form";
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
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import CarderProvider from "./CarderProvider";
import { useNavigate } from "react-router-dom";
import "./JobProviderDashboard.css";

function JobProviderDashboard() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
  const [showCustomJobType, setShowCustomJobType] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const jobsPerPage = 8;
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const locations = [
    "Dobinala Junction",
    "Ara Mile",
    "Marwari Patti",
    "Police Point",
    "Toluvi Junction Purana Bazar",
    "City Tower",
    "D. C. Court",
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jobTitle: "",
      jobType: "",
      payment: "",
      peopleNeeded: "",
      location: "",
      date: "",
      time: "",
      negotiability: false,
      customJobType: "",
    }
  });

  const jobType = watch("jobType");

  const fetchJobs = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://nagaconnect-iitbilai.onrender.com/jobProvider/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setJobs(response.data))
        .catch((error) => console.error("Error fetching jobs:", error));
    } else {
      navigate("/job-provider/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCloseTicketModal = () => {
    setTicketModalOpen(false);
    reset();
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
    const value = e.target.value;
    setShowCustomJobType(value === "others");
    setValue("jobType", value);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErr("Please select an image");
      setSelectedImg(null);
      return;
    }
    
    if (!file.type.startsWith("image/")) {
      setErr("Please select a valid image file");
      setSelectedImg(null);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErr("Image size should be less than 5MB");
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
      
      const processedJobDetails = {
        ...jobDetails,
        negotiability: jobDetails.negotiability ? "Negotiable" : "Non-Negotiable",
        jobType: jobDetails.jobType === "others" ? jobDetails.customJobType : jobDetails.jobType,
        payment: Number(jobDetails.payment),
        peopleNeeded: Number(jobDetails.peopleNeeded)
      };

      formData.append("jobDetails", JSON.stringify(processedJobDetails));
      formData.append("image", selectedImg);

      const response = await axios.post(
        "https://nagaconnect-iitbilai.onrender.com/jobProvider/addJob",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        alert("Job posted successfully!");
        fetchJobs();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error posting job:", error);
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

  const handlePageChange = (event, value) => setPage(value);

  const currentJobs = jobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

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
          Previous Job Listings
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

      {/* Job Posting Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Post a Job</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(formSubmit)} encType="multipart/form-data">
            <TextField
              fullWidth
              label="Job Title"
              margin="normal"
              {...register("jobTitle", { 
                required: "Job title is required",
                minLength: { value: 3, message: "Job title must be at least 3 characters" }
              })}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle?.message}
            />

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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={Object.keys(errors).length > 0 || !selectedImg}
            >
              Post Job
            </Button>
          </form>
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
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              {...register("title", { 
                required: "Title is required",
                minLength: { value: 3, message: "Title must be at least 3 characters" }
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            
            <TextField
              fullWidth
              label="Issue Description"
              margin="normal"
              multiline
              rows={4}
              {...register("description", { 
                required: "Description is required",
                minLength: { value: 10, message: "Description must be at least 10 characters" }
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!!errors.title || !!errors.description}
            >
              Submit Ticket
            </Button>
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