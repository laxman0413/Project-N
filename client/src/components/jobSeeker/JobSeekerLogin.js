import React, { useState } from 'react';
import axios from 'axios';
function JobSeekerLogin() {
  const [credentials, setCredentials] = useState({
    phone: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = () => {
    // Make sure role is not empty
    if (credentials.role === '') {
      alert('Please select a role');
      return;
    }
    axios.post('http://localhost:3001/joblogin', credentials)
      .then(response => {
        console.log('Login successful:', response.data);
        // You might want to save the token in localStorage or context
        localStorage.setItem('token', response.data.token);
      })
      .catch(error => {
        console.error('Error logging in:', error);
      });
  };
  return (
    <div>
        <form onSubmit={(event) => {
      event.preventDefault();
      handleFormSubmit();
    }}>
      <label>
        Phone:
        <input type="text" name="phone" value={credentials.phone} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={credentials.password} onChange={handleChange} />
      </label>
      <button type="submit">Login</button>
    </form>
    </div>
  )
}

export default JobSeekerLogin