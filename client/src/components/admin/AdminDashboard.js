import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // For professional UI styling

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]); // Initialize as an empty array
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch job details from the backend with Authorization token
    const fetchJobs = async () => {
      try {
        // Get token from localStorage or where you store it
        const token = localStorage.getItem('token');

        // If token doesn't exist, handle error or redirect
        if (!token) {
          setError('Unauthorized: No token found');
          return;
        }

        // Make GET request with token in the Authorization header
        const response = await axios.get('http://localhost:3001/admin/getjobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data); // Assuming the response data is an array
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again later.');
      }
    };

    fetchJobs();
  }, []);

  // Handle job row click to show full details
  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard - Job Listings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="job-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Job Title</th>
            <th>Posted By</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job.id} onClick={() => handleJobClick(job)} className="job-row">
                <td>{job.id}</td>
                <td>{job.jobTitle}</td>
                <td>{job.providerName}</td> {/* Assuming `providerName` comes from backend */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No jobs found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedJob && (
        <div className="job-details-container">
          <h3>Job Details</h3>
          <div className="job-details">
            <p><strong>Job ID:</strong> {selectedJob.id}</p>
            <p><strong>Job Title:</strong> {selectedJob.jobTitle}</p>
            <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
            {selectedJob.customJobType && (
              <p><strong>Custom Job Type:</strong> {selectedJob.customJobType}</p>
            )}
            <p><strong>Payment:</strong> ${selectedJob.payment}</p>
            <p><strong>People Needed:</strong> {selectedJob.peopleNeeded}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Date:</strong> {new Date(selectedJob.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedJob.time}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <p><strong>Posted By:</strong> {selectedJob.providerName}</p>
            <p><strong>Negotiability:</strong> {selectedJob.negotiability}</p>

            {/* Displaying job image (Cloudinary) */}
            {selectedJob.images && (
              <div className="job-image-container">
                <img src={selectedJob.images} alt="Job" className="job-image" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
