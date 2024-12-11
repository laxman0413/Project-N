// JobSeekerDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CarderSeeker from './CarderSeeker';
import AdCardPrivate from '../advertisement/AdCardPrivate';
import Menu from './Menu';
import Footer from '../Footer';
import './JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [ads, setAds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [locationQuery, setLocationQuery] = useState('');

  const navigate = useNavigate();
  const jobsPerPage = 9;
  const adsPerPage = 3;

  const fetchJobs = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/job-seeker/login");
      return;
    }

    try {
      const [jobResponse, adsResponse] = await Promise.all([
        axios.get('https://nagaconnect-iitbilai.onrender.com/jobSeeker/jobdetails', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://nagaconnect-iitbilai.onrender.com/advertise/getAds', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setJobs(jobResponse.data);
      setLocations([...new Set(jobResponse.data.map(job => job.location))]);
      setAds(adsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearchQuery = searchQuery === '' || job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationQuery === '' || job.location === locationQuery;

    return matchesSearchQuery && matchesLocation;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage, 
    currentPage * jobsPerPage
  );
  const currentAds = ads.slice(
    (currentPage - 1) * adsPerPage,
    currentPage * adsPerPage
  );

  return (
    <div className="job-seeker-dashboard">
      <header className="dashboard-header">
        <Menu />
      </header>

      <main className="dashboard-main">
        <div className="search-container">
          <div className="search-bar">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="location-selector">
            <LocationOnIcon className="location-icon" />
            <select
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="location-dropdown"
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-grid">
          {currentJobs.map((job, index) => (
            <React.Fragment key={job.id || index}>
              <CarderSeeker className="card-seeker" job={job} fetchJobs={fetchJobs} />
              {(index + 1) % 3 === 0 && currentAds.length > Math.floor(index / 3) && (
                <AdCardPrivate ad={currentAds[Math.floor(index / 3)]} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobSeekerDashboard;