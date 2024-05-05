import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
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
        Username:
        <input type="text" name="username" value={credentials.username} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={credentials.password} onChange={handleChange} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
