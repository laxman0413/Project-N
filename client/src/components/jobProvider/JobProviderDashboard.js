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
    formState: { errors },
  } = useForm();
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
  };
  const handlePostJobClick = () => setModalOpen(true);

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowCustomJobType(false);
    setErr("");
    setSelectedImg(null);
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
      axios.post('https://nagaconnect-iitbilai.onrender.com/jobProvider/RaiseTicket', {
        ...ticketData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          alert('Ticket raised successfully!');
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
