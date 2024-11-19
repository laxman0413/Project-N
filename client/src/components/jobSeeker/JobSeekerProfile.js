import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Logincontex } from '../jobSeeker/JobseekerloginContext/Logincontext'; // Correct import
import { FaUser, FaBirthdayCake, FaPhone, FaGenderless, FaBriefcase } from 'react-icons/fa';
import Menu from './Menu';

function JobSeekerProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);  // Track edit mode
  const [editData, setEditData] = useState({
    name: '',
    age: '',
    phone: '',
    sex: '',
    jobType: '',
  });
  const [currentuser, , userloginStatus] = useContext(Logincontex);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://nagaconnect-iitbilai.onrender.com/jobseeker/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setProfile(response.data);
        setEditData({
          name: response.data.name,
          age: response.data.age,
          phone: response.data.phone,
          sex: response.data.sex,
          jobType: response.data.jobType,
        });
      })
      .catch(() => {
        setError('Error fetching profile details. Please try again later.');
      });
    } else {
      setError('User not authenticated');
    }
  }, [userloginStatus]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      axios.put('https://nagaconnect-iitbilai.onrender.com/jobseeker/updateProfile', editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        alert("User Profile edited Successfully");
        setProfile(editData);  // Update profile with the new data
        setIsEditing(false);  // Exit edit mode
      })
      .catch(() => {
        setError('Error updating profile. Please try again later.');
      });
    }
  };

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

  const jobOptions = [
    { label: 'Construction', value: 'construction' },
    { label: 'Factory work', value: 'factory_work' },
    { label: 'Agriculture', value: 'agriculture' },
    { label: 'Domestic work', value: 'domestic_work' },
    { label: 'Transportation', value: 'transportation' }
  ];

  return (
    <div>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#f8f9fa' }}>
        <Menu />
      </div>

      <div style={styles.container}>
        <div style={styles.profileHeader}>
          <img
            src={profile.image || 'https://via.placeholder.com/100'}
            alt="Profile"
            style={styles.avatar}
          />
          <h2>{profile.name}</h2>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                value={editData.name} 
                onChange={handleChange} 
                style={styles.input} 
              />
            </div>
            <div style={styles.formGroup}>
              <label>Age</label>
              <input 
                type="number" 
                name="age" 
                value={editData.age} 
                onChange={handleChange} 
                style={styles.input} 
              />
            </div>
            <div style={styles.formGroup}>
              <label>Phone</label>
              <input 
                type="text" 
                name="phone" 
                value={editData.phone} 
                onChange={handleChange} 
                style={styles.input} 
              />
            </div>
            <div style={styles.formGroup}>
              <label>Sex</label>
              <select 
                name="sex" 
                value={editData.sex} 
                onChange={handleChange} 
                style={styles.input}
              >
                <option value="" disabled>Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Job Type</label>
              <select 
                name="jobType" 
                value={editData.jobType} 
                onChange={handleChange} 
                style={styles.input}
              >
                <option value="" disabled>Type of Job</option>
                {jobOptions.map((option, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={styles.saveButton}>Save Changes</button>
          </form>
        ) : (
          <div style={styles.detailsContainer}>
            <div style={styles.detail}>
              <FaUser style={styles.icon} />
              <p>{profile.name}</p>
            </div>
            <div style={styles.detail}>
              <FaBirthdayCake style={styles.icon} />
              <p>Age: {profile.age}</p>
            </div>
            <div style={styles.detail}>
              <FaPhone style={styles.icon} />
              <p>{profile.phone}</p>
            </div>
            <div style={styles.detail}>
              <FaGenderless style={styles.icon} />
              <p>Sex: {profile.sex}</p>
            </div>
            <div style={styles.detail}>
              <FaBriefcase style={styles.icon} />
              <p>Job Type: {profile.jobType}</p>
            </div>
            <button onClick={handleEditClick} style={styles.editButton}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '80px auto 20px',
    padding: '20px',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto',
  },
  detailsContainer: {
    marginTop: '20px',
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  icon: {
    marginRight: '15px',
    color: 'black',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    marginTop: '5px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
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
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  saveButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default JobSeekerProfile;
