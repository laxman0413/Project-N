import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Logincontex } from '../jobProvider/JobProviderloginContext/Logincontext';  // Correct import
import { FaUser, FaBirthdayCake, FaPhone, FaBriefcase, FaGenderless } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

function JobSeekerProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [currentuser, , userloginStatus] = useContext(Logincontex);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3001/jobProvider/profile', {
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
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</div>;
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#ddd', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '50px', color: '#666' }}>
          <FaUser />
        </div>
        <h2>{profile.name}</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <FaUser style={{ marginRight: '10px', color: '#888' }} />
        <p style={{ margin: 0 }}>{profile.name}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <FaBirthdayCake style={{ marginRight: '10px', color: '#888' }} />
        <p style={{ margin: 0 }}>Birthday: {profile.age}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <FaPhone style={{ marginRight: '10px', color: '#888' }} />
        <p style={{ margin: 0 }}>{profile.phone}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <FaGenderless style={{ marginRight: '10px', color: '#888' }} />
        <p style={{ margin: 0 }}>Sex: {profile.sex}</p>
      </div>
      <button style={{ width: '100%', padding: '10px', backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit Profile</button>
    </div>
  );
}

export default JobSeekerProfile;
