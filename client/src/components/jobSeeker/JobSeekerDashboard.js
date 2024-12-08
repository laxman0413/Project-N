import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Ticket, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import CarderSeeker from './CarderSeeker';
import AdCardPrivate from '../advertisement/AdCardPrivate';
import Menu from './Menu';

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [ads, setAds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState({ title: '', description: '' });
  const [ticketErrors, setTicketErrors] = useState({});
  
  const navigate = useNavigate();
  const jobsPerPage = 8;
  const adsPerPage = 2;

  const fetchJobs = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/job-seeker/login");
      return;
    }
    
    try {
      const [jobResponse, adsResponse] = await Promise.all([
        axios.get('https://nagaconnect-iitbilai.onrender.com/jobSeeker/jobdetails', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://nagaconnect-iitbilai.onrender.com/advertise/getAds', {
          headers: { Authorization: `Bearer ${token}` }
        })
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

  const handleLocationChange = (location) => {
    setSelectedLocations(prev => 
      prev.includes(location) ? prev.filter(loc => loc !== location) : [...prev, location]
    );
  };

  const handleWorkTypeChange = (workType) => {
    setSelectedWorkTypes(prev => 
      prev.includes(workType) ? prev.filter(type => type !== workType) : [...prev, workType]
    );
  };

  const applyFilters = useCallback((job) => {
    const normalizedJobType = (job.customJobType || job.jobTitle || '').trim().toLowerCase();
    const searchMatches = searchQuery === '' || 
      Object.values(job).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(searchQuery)
      );
    const locationMatches = selectedLocations.length === 0 || 
      selectedLocations.includes(job.location);
    const workTypeMatches = selectedWorkTypes.length === 0 || 
      selectedWorkTypes.includes(normalizedJobType);

    return searchMatches && locationMatches && workTypeMatches;
  }, [searchQuery, selectedLocations, selectedWorkTypes]);

  const filteredJobs = jobs.filter(applyFilters);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage, 
    currentPage * jobsPerPage
  );
  const currentAds = ads.slice(
    (currentPage - 1) * adsPerPage,
    currentPage * adsPerPage
  );

  const handleTicketSubmit = async () => {
    const errors = {};
    if (!ticketData.title) errors.title = "Title is required";
    if (!ticketData.description) errors.description = "Description is required";
    
    if (Object.keys(errors).length > 0) {
      setTicketErrors(errors);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/job-seeker/login");
      return;
    }

    try {
      await axios.post(
        'https://nagaconnect-iitbilai.onrender.com/jobSeeker/RaiseTicket',
        ticketData,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Rasied ticket successfully");
      setTicketModalOpen(false);
      setTicketData({ title: '', description: '' });
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };

  return (
    <div >
      <header>
            <div
              style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                backgroundColor: '#f8f9fa',
                paddingBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
          <div style={{ width: '100%' }}>
            <Menu />
          </div>

          {/* Buttons Section */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
              className='btn'
              onClick={()=>setTicketModalOpen(true)}
              style={{
                backgroundColor: 'white',
                color: 'blue',
                border: '2px solid blue',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              RAISE A TICKET
            </button>
              <Link
                to="/job-seeker/applied-jobs"
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Applied Jobs
              </Link>
            </div>
        </div>
      </header>
      <pre> </pre>
      <pre> </pre>
      <pre> </pre>
      <pre> </pre>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="mb-8 space-y-4">
          <h1> Resently Posted Jobs</h1>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              />
            </div>
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {isFilterVisible && (
          <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-8">
              {/* Location Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                <div className="space-y-3">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                        checked={selectedLocations.includes(location)}
                        onChange={() => handleLocationChange(location)}
                      />
                      <span className="text-sm text-gray-700">{location   }</span>
                    </div>
                  ))}
                </div>
              </div>
                  <pre> </pre>
              {/* Work Type Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Type</h3>
                <div className="space-y-3">
                  {["construction", "factoryWork", "agriculture", "transportation", "domesticWork", "others"].map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                        checked={selectedWorkTypes.includes(type)}
                        onChange={() => handleWorkTypeChange(type)}
                      />
                      <span className="text-sm text-gray-700">
                        {type.split(/(?=[A-Z])/).join(" ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
          <pre> </pre>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map((job, index) => (
            <React.Fragment key={job.id || index}>
              <CarderSeeker job={job} fetchJobs={fetchJobs} />
              {(index + 1) % 3 === 0 && currentAds.length > Math.floor(index / 3) && (
                <AdCardPrivate ad={currentAds[Math.floor(index / 3)]} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </main>

      <Dialog
        open={isTicketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Raise a Ticket</Typography>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              autoFocus
              label="Title"
              fullWidth
              value={ticketData.title}
              onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
              error={!!ticketErrors.title}
              helperText={ticketErrors.title}
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={ticketData.description}
              onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
              error={!!ticketErrors.description}
              helperText={ticketErrors.description}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTicketModalOpen(false)}>Cancel</Button>
          <Button onClick={handleTicketSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobSeekerDashboard;