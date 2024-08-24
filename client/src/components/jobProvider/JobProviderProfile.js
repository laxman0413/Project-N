import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Logincontex } from '../jobProvider/JobProviderloginContext/Logincontext'; // Correct import
import { FaUser, FaPhone } from 'react-icons/fa';

function JobSeekerProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [currentuser, , userloginStatus] = useContext(Logincontex);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://nagaconnect-iitbilai.onrender.com/jobProvider/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setProfile(response.data);
      })
      .catch(() => {
        setError('Error fetching profile details. Please try again later.');
      });
    } else {
      setError('User not authenticated');
    }
  }, [userloginStatus]);

  if (error) {
    return (
      <div style={styles.error}>
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.loading}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        <img
          src={profile.image || 'https://via.placeholder.com/100'}
          alt="Profile"
          style={styles.avatar}
        />
        <h2>{profile.name}</h2>
      </div>
      <div style={styles.detail}>
        <FaPhone style={styles.icon} />
        <p>{profile.phone}</p>
      </div>
      <button style={styles.editButton}>Edit Profile</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto',
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  icon: {
    marginRight: '10px',
    color: '#888',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20px',
  },
  editButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default JobSeekerProfile;
