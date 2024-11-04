import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Menu from './Menu';
import CarderSeeker from './CarderSeeker';
import AdCard from '../advertisement/AdCard';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from '@mui/material';
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

  // States for Ticket Modal
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState({
    title: '',
    description: ''
  });
  const [ticketErrors, setTicketErrors] = useState({});

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

  // Handlers for Ticket Modal
  const handleOpenTicketModal = () => {
    setTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setTicketModalOpen(false);
    setTicketData({ title: '', description: '' });
    setTicketErrors({});
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateTicket = () => {
    const errors = {};
    if (!ticketData.title) {
      errors.title = "Title is required";
    }
    if (!ticketData.description) {
      errors.description = "Description is required";
    }
    return errors;
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const errors = validateTicket();
    if (Object.keys(errors).length > 0) {
      setTicketErrors(errors);
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://localhost:3001/jobSeeker/RaiseTicket', ticketData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Ticket raised successfully:', response.data);
          handleCloseTicketModal();
          // Optionally, you can show a success message to the user
        })
        .catch(error => {
          console.error('Error raising ticket:', error);
          // Optionally, handle error (e.g., show error message)
        });
    } else {
      console.log("Please Login First");
      navigate("/job-seeker/login");
    }
  };

  return (
    <div>
      {/* Fixed Menu Bar */}
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#f8f9fa' }}>
        <Menu />
      </div>

      {/* Spacer to prevent content from being hidden behind fixed menu */}
      <div style={{ paddingTop: '60px' }}></div>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Ticket Modal */}
        <Dialog open={isTicketModalOpen} onClose={handleCloseTicketModal}>
          <DialogTitle>Raise a Ticket</DialogTitle>
          <DialogContent>
            <form onSubmit={handleTicketSubmit}>
              <div className="mb-3">
                <TextField
                  autoFocus
                  margin="dense"
                  label="Title"
                  name="title"
                  fullWidth
                  variant="standard"
                  value={ticketData.title}
                  onChange={handleTicketChange}
                  error={!!ticketErrors.title}
                  helperText={ticketErrors.title}
                />
              </div>
              <div className="mb-3">
                <TextField
                  margin="dense"
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="standard"
                  value={ticketData.description}
                  onChange={handleTicketChange}
                  error={!!ticketErrors.description}
                  helperText={ticketErrors.description}
                />
              </div>
              <DialogActions>
                <Button onClick={handleCloseTicketModal}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Raise a Ticket Button */}
        <button className="raise-ticket-btn" onClick={handleOpenTicketModal}>
          Raise a Ticket
        </button>

        {/* Applied Jobs Button */}
        <button className="applied-jobs-btn">
          <Link to="/job-seeker/applied-jobs">Applied Jobs</Link>
        </button>
        <br />

        {/* Filter Button */}
        <button className="filter-btn" onClick={toggleFilterVisibility}>Filter Jobs</button>
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

        {/* Search Bar */}
        <input
          type='text'
          placeholder='Search for jobs'
          className='search-bar'
          onChange={handleSearchChange}
          value={searchQuery}
        />

        {/* Jobs Available */}
        <h3>Jobs Available</h3>
        {currentJobs.length > 0 ? (
          <div className="jobs-grid">
            {currentJobs.map((job, index) => (
              <div key={job.id || index} className="job-card-wrapper">
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

        {/* Pagination */}
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
