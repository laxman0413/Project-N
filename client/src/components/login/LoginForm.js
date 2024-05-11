import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [credentials, setCredentials] = useState({
    phone: '',
    password: '',
    role: '' // Added role to the state
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
    axios.post('http://localhost:3001/login', credentials)
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
      <label>
        Role:
        <select name="role" value={credentials.role} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="provider">Job Provider</option>
          <option value="seeker">Job Seeker</option>
        </select>
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
