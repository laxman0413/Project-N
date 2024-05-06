import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    phone: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = () => {
    axios.post('http://localhost:3001/register', userData)
      .then(response => {
        console.log('User registered:', response.data);
        // handle success such as clearing the form or informing the user
      })
      .catch(error => {
        console.error('Error registering user:', error);
      });
  };

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      handleFormSubmit();
    }}>
      <label>
        Username:
        <input type="text" name="username" value={userData.username} onChange={handleChange} />
      </label>
      <label>
        Phone:
        <input type="text" name="phone" value={userData.phone} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={userData.password} onChange={handleChange} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
