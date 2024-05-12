import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    password: '',
    role: '', // Set default role to 'seeker'
    age: '', // Initialize age field
    sex: '', // Initialize sex field
    location: '' // Initialize location field
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userData.name || !userData.phone || !userData.password) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/register', userData);
      alert('Registration successful');
      console.log(response.data);
    } catch (error) {
      alert('Failed to register');
      console.error('Error registering:', error.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={userData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Phone:</label>
        <input type="text" name="phone" value={userData.phone} onChange={handleChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={userData.password} onChange={handleChange} />
      </div>
      <div>
        <label>Role:</label>
        <select name="role" value={userData.role} onChange={handleChange}>
          <option value="seeker">Job Seeker</option>
          <option value="provider">Job Provider</option>
        </select>
      </div>
      {userData.role === 'seeker' && (
        <>
          <div>
            <label>Age:</label>
            <input type="text" name="age" value={userData.age} onChange={handleChange} />
          </div>
          <div>
            <label>Sex:</label>
            <div>
              <input type="radio" id="male" name="sex" value="male" onChange={handleChange} />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input type="radio" id="female" name="sex" value="female" onChange={handleChange} />
              <label htmlFor="female">Female</label>
            </div>
            <div>
              <input type="radio" id="other" name="sex" value="other" onChange={handleChange} />
              <label htmlFor="other">Other</label>
            </div>
          </div>
          <div>
            <label>Location:</label>
            <select name="location" value={userData.location} onChange={handleChange}>
            <option value="">Select Location</option>
            <option value="POINT (93.721178 25.9067749)">Dobinala Junction</option>
            <option value="POINT (93.75633619999999 25.8935993)">Ara mile</option>
            <option value="POINT (93.7250851 25.9060926)">Marwari Patti</option>
            <option value="POINT (93.73347679999999 25.9067618)">Police Point (Nagarjan Junction)</option>
            <option value="POINT (93.74781879999999 25.9065732)">Toluvi Junction Purana Bazar</option>
            <option value="POINT (93.72046429999999 25.9114986)">City Tower</option>
            <option value="POINT (93.72656049999999 25.9091406)">D. C. Court</option>
            <option value="POINT (93.728417 25.913722)">Golaghat Road Junction</option>
            <option value="POINT (93.733917 25.913139)">Burma Camp Junction</option>
            <option value="POINT (93.746222 25.910944)">Zion Hospital road Junction</option>
            <option value="POINT (93.754972 25.897250)">Padampukhuri Road Junction</option>
            <option value="POINT (93.758250 25.890194)">Aramile junction</option>
            </select>
          </div>
        </>
      )}
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
