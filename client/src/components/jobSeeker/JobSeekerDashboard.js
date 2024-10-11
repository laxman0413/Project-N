import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from './Menu';
import CarderSeeker from './CarderSeeker';
import AdCard from '../advertisement/AdCard';
import { Link } from 'react-router-dom';
import './JobSeekerDashboard.css'; // Import CSS file for styles

function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/job-seeker/login");
    } else {
      axios.get('https://nagaconnect-iitbilai.onrender.com/jobSeeker/jobdetails', { headers: { Authorization: 'Bearer ' + token } })
        .then(response => {
          const jobsData = response.data;

          // Set jobs and unique locations
          setJobs(jobsData);

          const uniqueLocations = [...new Set(jobsData.map(job => job.location))];
          setLocations(uniqueLocations);
        })
        .catch(error => console.error('Error fetching job details:', error));

      axios.get('https://nagaconnect-iitbilai.onrender.com/advertise/getAds', { headers: { Authorization: 'Bearer ' + token } })
        .then(response => setAds(response.data))
        .catch(error => console.error('Error fetching ads:', error));
    }
  }, [navigate]);

  const toggleFilterVisibility = () => setIsFilterVisible(!isFilterVisible);

  const handleSearchChange = (event) => setSearchQuery(event.target.value.trim().toLowerCase());

  const handleLocationChange = (location) => {
    setSelectedLocations(prevSelectedLocations =>
      prevSelectedLocations.includes(location)
        ? prevSelectedLocations.filter(loc => loc !== location)
        : [...prevSelectedLocations, location]
    );
  };

  const handleWorkTypeChange = (workType) => {
    setSelectedWorkTypes(prevSelectedWorkTypes =>
      prevSelectedWorkTypes.includes(workType)
        ? prevSelectedWorkTypes.filter(type => type !== workType)
        : [...prevSelectedWorkTypes, workType]
    );
  };

  const applyFilters = (job) => {
    const normalizedJobType = (job.customJobType || job.jobTitle || '').trim().toLowerCase();

    const locationMatches = selectedLocations.length === 0 || selectedLocations.includes(job.location);
    const workTypeMatches = selectedWorkTypes.length === 0 || selectedWorkTypes.includes(normalizedJobType);
    const searchMatches = searchQuery === '' || Object.values(job).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery)
    );

    return locationMatches && workTypeMatches && searchMatches;
  };

  const filteredJobs = jobs.filter(applyFilters);

  // Pagination logic
  const jobsPerPage = 8;
  const adsPerPage = 2;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const totalAdsPages = Math.ceil(ads.length / adsPerPage);
  
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
  const currentAds = ads.slice(((currentPage - 1) * adsPerPage), currentPage * adsPerPage);

  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => {
      if (direction === 'next') return Math.min(prevPage + 1, totalPages);
      if (direction === 'prev') return Math.max(prevPage - 1, 1);
      return prevPage;
    });
  };

  return (
    <div >
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#f8f9fa' }}>
        <Menu />
      </div>
      <pre>  </pre>
      <pre>  </pre>
      
      <div >
        <button className="applied-jobs-btn">
          <Link to="/job-seeker/applied-jobs">Applied Jobs</Link>
        </button>
        <br />
        <button className="filter-btn" onClick={toggleFilterVisibility}>Filter</button>
        {isFilterVisible && (
          <div className="filters">
            <h4>Filter by Location:</h4>
            <div className="filter-options">
              {locations.map((location, index) => (
                <div key={index} className="filter-item">
                  <input
                    type="checkbox"
                    id={location}
                    value={location}
                    checked={selectedLocations.includes(location)}
                    onChange={() => handleLocationChange(location)}
                  />
                  <label htmlFor={location}>{location}</label>
                </div>
              ))}
            </div>

            <h4>Filter by Type of Work:</h4>
            <div className="filter-options">
              {["construction", "factoryWork", "agriculture", "transportation", "domesticWork", "others"].map((workType, index) => (
                <div key={index} className="filter-item">
                  <input
                    type="checkbox"
                    id={workType}
                    value={workType}
                    checked={selectedWorkTypes.includes(workType)}
                    onChange={() => handleWorkTypeChange(workType)}
                  />
                  <label htmlFor={workType}>{workType.split(/(?=[A-Z])/).join(" ")}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          type='text'
          placeholder='Search for jobs'
          className='search-bar'
          onChange={handleSearchChange}
          value={searchQuery}
        />

        <h3>Jobs Available</h3>
        {currentJobs.length > 0 ? (
          <div className="jobs-grid">
            {currentJobs.map((job, index) => (
              <div key={index} className="job-card-wrapper">
                <CarderSeeker job={job} />
                {(index + 1) % 5 === 0 && currentAds.length > Math.floor(index / 5) && (
                  <AdCard ad={currentAds[Math.floor(index / 5)]} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No jobs match your search or filter criteria.</p>
        )}

        <div className="pagination">
          <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>Previous</button>
          <span> Page {currentPage} of {totalPages} </span>
          <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
