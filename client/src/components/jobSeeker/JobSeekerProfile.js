import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../jobSeeker/LoginContext';

function JobSeekerProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [currentuser, , userloginStatus] = useContext(LoginContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3001/jobseeker/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => {
        console.error('Error fetching profile details:', error);
        setError('Error fetching profile details. Please try again later.');
      });
    } else {
      setError('User not authenticated');
    }
  }, [userloginStatus]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Job Seeker Profile</h1>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Age:</strong> {profile.age}</p>
      <p><strong>Sex:</strong> {profile.sex}</p>
      <p><strong>Job Type:</strong> {profile.jobType}</p>
    </div>
  );
}

export default JobSeekerProfile;
