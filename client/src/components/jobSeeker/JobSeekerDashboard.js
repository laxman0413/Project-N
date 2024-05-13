import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from '../Menu';
import Carder from '../Carder';

function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch job details and available locations from the backend when the component mounts
    axios.get('http://localhost:3001/jobSeeker/jobdetails')
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

  // Function to toggle filter visibility
  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter jobs based on selected locations, work types, and search query
  const filteredJobs = jobs.filter(job => {
    if (selectedLocations.length > 0 && !selectedLocations.includes(job.location)) {
      return false;
    }
    if (selectedWorkTypes.length > 0 && !selectedWorkTypes.includes(job.jobType)) {
      return false;
    }
    if (searchQuery && !Object.values(job).some(value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  // Function to handle location checkbox change
  const handleLocationChange = (location) => {
    setSelectedLocations(prevSelectedLocations => {
      if (prevSelectedLocations.includes(location)) {
        return prevSelectedLocations.filter(loc => loc !== location);
      } else {
        return [...prevSelectedLocations, location];
      }
    });
  };

  // Function to handle work type checkbox change
  const handleWorkTypeChange = (workType) => {
    setSelectedWorkTypes(prevSelectedWorkTypes => {
      if (prevSelectedWorkTypes.includes(workType)) {
        return prevSelectedWorkTypes.filter(type => type !== workType);
      } else {
        return [...prevSelectedWorkTypes, workType];
      }
    });
  };

  return (
    <div>
      <Menu />
      <button onClick={toggleFilterVisibility}>Filter</button>
      {isFilterVisible && (
        <div>
          {/* Filter by Location */}
          <h4>Filter by Location:</h4>
          {locations.map((location, index) => (
            <div key={index}>
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

          {/* Filter by Type of Work */}
          <h4>Filter by Type of Work:</h4>
          <div>
            <input
              type="checkbox"
              id="construction"
              value="construction"
              checked={selectedWorkTypes.includes("construction")}
              onChange={() => handleWorkTypeChange("construction")}
            />
            <label htmlFor="construction">Construction</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="factoryWork"
              value="factoryWork"
              checked={selectedWorkTypes.includes("factoryWork")}
              onChange={() => handleWorkTypeChange("factoryWork")}
            />
            <label htmlFor="factoryWork">Factory work</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="agriculture"
              value="agriculture"
              checked={selectedWorkTypes.includes("agriculture")}
              onChange={() => handleWorkTypeChange("agriculture")}
            />
            <label htmlFor="agriculture">Agriculture</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="transportation"
              value="transportation"
              checked={selectedWorkTypes.includes("transportation")}
              onChange={() => handleWorkTypeChange("transportation")}
            />
            <label htmlFor="transportation">Transportation</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="domesticWork"
              value="domesticWork"
              checked={selectedWorkTypes.includes("domesticWork")}
              onChange={() => handleWorkTypeChange("domesticWork")}
            />
            <label htmlFor="domesticWork">Domestic work</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="others"
              value="others"
              checked={selectedWorkTypes.includes("others")}
              onChange={() => handleWorkTypeChange("others")}
            />
            <label htmlFor="others">Others</label>
          </div>
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

export default JobSeekerDashboard;