import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ListOfApplications.css";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import logoImage from '../logo.png'; 
import Menu from "./Menu";

function ListOfApplications() {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [applications, setApplications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState("");
  const navigate = useNavigate();

  // Fetch job details and applications
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`https://nagaconnect-iitbilai.onrender.com/jobProvider/jobDetails/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setJobDetails(response.data))
        .catch((error) => console.error("Error fetching job details:", error));

      axios
        .get(`https://nagaconnect-iitbilai.onrender.com/jobProvider/applications/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setApplications(response.data))
        .catch((error) => console.error("Error fetching applications:", error));
    }
  }, [jobId]);

  const handleChat = (phoneNum) => `https://wa.me/+91${phoneNum}`;
  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setApplicationStatus(application.ApplicationStatus || "Pending");
    setOpenModal(true);
  };

  const handleUpdateStatus = () => {
    const token = localStorage.getItem('token');
    if (selectedApplication && token) {
      axios
        .put(
          `https://nagaconnect-iitbilai.onrender.com/jobProvider/applications/${selectedApplication.application_id}/updateStatus`,
          { ApplicationStatus: applicationStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          // Update application status locally
          setApplications((prev) =>
            prev.map((app) =>
              app.application_id === selectedApplication.application_id
                ? { ...app, ApplicationStatus: applicationStatus }
                : app
            )
          );
  
          // Close modal
          setOpenModal(false);
  
          // Send notification if status is "Shortlisted"
          if (applicationStatus === "Shortlisted") {
            console.log('Sending notification...');
            console.log(selectedApplication.seeker_id);
            axios
              .post(
                'https://nagaconnect-iitbilai.onrender.com/notifications/create',
                {
                  receiverId: selectedApplication.seeker_id, // Use seeker_id from the selected application
                  data: `Your application for job ID ${jobId} has been accepted`,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then(() => {
                console.log('Notification sent');
              })
              .catch((error) => {
                console.error('Error sending notification:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error updating status:', error);
        });
    }
  };

  return (
    <div >
      {/* Sidebar */}
      <div>
            <Menu />
      </div>
      <div className="list-of-applications">
      <aside className="sidebar">
        

        <div className="job-details">
          <h2>Job Details</h2>
          {jobDetails ? (
            <ul>
              <li>
                <strong>Job Type:</strong> {jobDetails.jobType}
              </li>
              <li>
                <strong>Payment:</strong> {jobDetails.payment}
              </li>
              <li>
                <strong>People Needed:</strong> {jobDetails.peopleNeeded}
              </li>
              <li>
                <strong>Location:</strong> {jobDetails.location}
              </li>
              <li>
                <strong>Expires In:</strong> {jobDetails.date}
              </li>
              <li>
                <strong>Description:</strong>{" "}
                {jobDetails.description || "No description provided"}
              </li>
            </ul>
          ) : (
            <p>Loading job details...</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">

        <div className="talent-grid">
          <h1>Applications</h1>
          <Grid container spacing={2}>
            {applications.map((application) => (
              <Grid item xs={12} sm={6} key={application.application_id}>
                <Card className="talent-card">
                  <CardContent>
                    <div
                      onClick={() =>
                        navigate(`/spprofile/${application.seeker_id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={application.image || "https://via.placeholder.com/300x150"}
                        alt={application.name}
                        className="application-image"
                      />
                      <Typography
                        variant="h6"
                        className="application-name"
                        sx={{ fontWeight: "bold", marginTop: "10px" }}
                      >
                        {application.name}
                      </Typography>
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Sex:</strong> {application.sex}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Age:</strong> {application.age}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Phone:</strong> {application.phone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Status:</strong>{" "}
                      {application.ApplicationStatus || "Pending"}
                    </Typography>
                  </CardContent>
                  <Box className="card-actions">
                    <Button
                      variant="contained"
                      color="success"
                      href={handleChat(application.phone)}
                      target="_blank"
                      sx={{ fontSize: "12px" }}
                    >
                      Chat
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEditClick(application)}
                      sx={{ fontSize: "12px" }}
                    >
                      Edit
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>

      {/* Modal for Status Update */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="modal-box">
          <Typography variant="h6">Update Status</Typography>
          <TextField
            select
            label="Status"
            value={applicationStatus}
            onChange={(e) => setApplicationStatus(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: "20px" }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shortlisted">Shortlisted</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateStatus}
            fullWidth
          >
            Update
          </Button>
        </Box>
      </Modal>
      </div>
    </div>
  );
}

export default ListOfApplications;
