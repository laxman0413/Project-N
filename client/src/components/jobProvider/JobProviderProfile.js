import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Logincontex } from '../jobProvider/JobProviderloginContext/Logincontext';
import { FaUser, FaPhone, FaEdit } from 'react-icons/fa';
import Menu from './Menu';
import Swal from 'sweetalert2';
function showAlert(data){
  Swal.fire({
    title: data,
    confirmButtonText: 'OK'
  })
}
function JobProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [currentuser, , userloginStatus] = useContext(Logincontex);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

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
        setEditedProfile(response.data);
      })
      .catch(() => {
        setError('Error fetching profile details. Please try again later.');
      });
    } else {
      setError('User not authenticated');
    }
  }, [userloginStatus]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.put('https://nagaconnect-iitbilai.onrender.com/jobProvider/updateProfile', 
        {
          name: editedProfile.name,
          phone: editedProfile.phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(response => {
        showAlert(response.data.message);
        console.log(response.data);
        setProfile(editedProfile);
        setIsEditing(false);
      })
      .catch(error => {
        setError('Error updating profile. Please try again.');
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

  return (
    <div style={styles.body}>
      <div style={styles.menuContainer}>
        <Menu />
      </div>
      <div style={styles.container}>
        <div style={styles.profileHeader}>
          <div style={styles.avatarContainer}>
            <img
              src={profile.image || 'https://via.placeholder.com/100'}
              alt="Profile"
              style={styles.avatar}
            />
          </div>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleInputChange}
              style={styles.editInput}
            />
          ) : (
            <h2 style={styles.name}>{profile.name}</h2>
          )}
        </div>
        <div style={styles.detailContainer}>
          <div style={styles.detail}>
            <FaPhone style={styles.icon} />
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editedProfile.phone}
                onChange={handleInputChange}
                style={styles.editInput}
              />
            ) : (
              <p style={styles.detailText}>{profile.phone}</p>
            )}
          </div>
        </div>
        {isEditing ? (
          <div style={styles.buttonGroup}>
            <button 
              style={styles.saveButton} 
              onClick={handleSaveProfile}
            >
              Save
            </button>
            <button 
              style={styles.cancelButton} 
              onClick={handleEditToggle}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            style={styles.editButton} 
            onClick={handleEditToggle}
          >
            <FaEdit style={{ marginRight: '10px' }} /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  body: {
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  menuContainer: {
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '30px',
    marginTop: '80px',
    border: '1px solid #e0e0e0',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #000',
  },
  name: {
    color: '#000',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  detailContainer: {
    marginBottom: '20px',
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '12px',
    borderRadius: '8px',
  },
  icon: {
    marginRight: '15px',
    color: '#000',
    fontSize: '20px',
  },
  detailText: {
    color: '#333',
    fontSize: '16px',
  },
  editInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #000',
    borderRadius: '6px',
    marginBottom: '10px',
    fontSize: '16px',
  },
  editButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  saveButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #000',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: '#ff0000',
    textAlign: 'center',
    marginTop: '20px',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20px',
  }
};

export default JobProviderProfile;