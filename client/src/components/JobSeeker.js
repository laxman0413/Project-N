import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';
import Carder from './Carder';

function JobSeeker() {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch job details and available locations from the backend when the component mounts
    axios.get('http://localhost:3001/jobdetails')
      .then(response => {
        setJobs(response.data);
        // Extracting unique locations from job details
        const uniqueLocations = [...new Set(response.data.map(job => job.location))];
        setLocations(uniqueLocations);
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
      });
  }, []);

  // Function to handle location filter
  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
  };

  // Function to handle work type filter
  const handleWorkTypeFilter = (workType) => {
    setSelectedWorkType(workType);
  };

  // Function to toggle filter visibility
  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter jobs based on selected location, work type, and search query
  const filteredJobs = jobs.filter(job => {
    if (selectedLocation && job.location !== selectedLocation) {
      return false;
    }
    if (selectedWorkType && job.jobType !== selectedWorkType) {
      return false;
    }
    if (searchQuery && !Object.values(job).some(value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <Menu />
      <button onClick={toggleFilterVisibility}>Filter</button>
      {isFilterVisible && (
        <div>
          {/* Filter by Location */}
          <h4>Filter by Location:</h4>
          {locations.map((location, index) => (
            <button key={index} onClick={() => handleLocationFilter(location)}>
              {location}
            </button>
          ))}

          {/* Filter by Type of Work */}
          <h4>Filter by Type of Work:</h4>
          <button onClick={() => handleWorkTypeFilter('construction')}>Construction</button>
          <button onClick={() => handleWorkTypeFilter('factoryWork')}>Factory work</button>
          <button onClick={() => handleWorkTypeFilter('agriculture')}>Agriculture</button>
          <button onClick={() => handleWorkTypeFilter('transportation')}>Transportation</button>
          <button onClick={() => handleWorkTypeFilter('domesticWork')}>Domestic work</button>
          <button onClick={() => handleWorkTypeFilter('others')}>Others</button>
        </div>
      )}

      {/* Search input */}
      <input type='text' placeholder='Search for jobs' className='search-bar' onChange={handleSearchChange} />

      <h3>Jobs Available </h3>

      {/* Render Carder component for each filtered job */}
      {filteredJobs.map((job, index) => (
        <Carder key={index} job={job} />
      ))}
    </div>
  );
}

export default JobSeeker;
