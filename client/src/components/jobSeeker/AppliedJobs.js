import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';
import CarderSeekerApp from './CarderSeekerApp';
import './AppliedJobs.css'; // For additional styling

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('https://nagaconnect-iitbilai.onrender.com/jobseeker/appliedJobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const jobsData = response.data.map((job, index) => ({
          ...job,
          application_id: job.application_id ?? `temp-${index}` // Ensure application_id is unique
        }));

        setAppliedJobs(jobsData);
      } else {
        setError("Please Login First");
      }
    } catch (error) {
      setError(`Error fetching applied jobs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = (application_id) => {
    setAppliedJobs(appliedJobs.filter(job => job.application_id !== application_id));
  };

  return (
    <div >
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#f8f9fa' }}>
        <Menu />
      </div>
      <pre>  </pre>
      <pre>  </pre>
      <h2 className="title">Applied Jobs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="applied-job-list">
          {appliedJobs.length > 0 ? (
            <div className="jobs-grid">
              {appliedJobs.map((job) => (
                <CarderSeekerApp key={job.application_id} job={job} onWithdraw={handleWithdraw} />
              ))}
            </div>
          ) : (
            <p className="no-jobs-message">No jobs applied yet.</p>
          )}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default AppliedJobs;