import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';
import CarderSeekerApp from './CarderSeekerApp';
import './AppliedJobs.css'; // For additional styling

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('https://nagaconnect-iitbilai.onrender.com/jobseeker/appliedJobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched applied jobs:', response.data);

        // Ensuring each job has a unique application_id
        const jobsData = response.data.map((job, index) => ({
          ...job,
          application_id: job.application_id ?? `temp-${index}` // Ensure application_id is unique
        }));

        setAppliedJobs(jobsData);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      }
    } else {
      console.log("Please Login First");
    }
  };

  const handleWithdraw = (application_id) => {
    setAppliedJobs(appliedJobs.filter(job => job.application_id !== application_id));
  };

  return (
    <div>
      <Menu />
      <h2>Applied Jobs</h2>
      <div className="applied-job-list">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <CarderSeekerApp key={job.application_id} job={job} onWithdraw={handleWithdraw} />
          ))
        ) : (
          <p>No jobs applied yet.</p>
        )}
      </div>
    </div>
  );
}

export default AppliedJobs;
